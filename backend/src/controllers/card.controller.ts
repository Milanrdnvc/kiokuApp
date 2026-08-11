import * as express from "express";
import Deck from "../models/Deck";
import CardContent from "../models/CardContent";
import CardUserData from "../models/CardUserData";
import UserDeckSettings from "../models/UserDeckSettings";
import { reviewCard, UnifiedReviewInput } from "../algorithms/main";
import { FSRSState } from "../algorithms/fsrs";
import { SM2State } from "../algorithms/sm2";
import ReviewLog from "../models/ReviewLog";

const processCardReview = async (
  userId: string,
  cardId: string,
  grade: number,
) => {
  let cardUserData = await CardUserData.findOne({ userId, cardId });
  if (!cardUserData) {
    cardUserData = new CardUserData({ userId, cardId });
  }

  const cardContent = await CardContent.findById(cardId);
  if (!cardContent) {
    return {
      success: false,
      message: "Error! Card not found.",
    };
  }

  const userDeckSettings = await UserDeckSettings.findOne({
    userId,
    deckId: cardContent.deckId,
  });

  const algorithm = userDeckSettings?.algorithm ?? "SM2";

  let elapsedDays = 0;
  if (cardUserData.lastReview) {
    const diffMs = Date.now() - cardUserData.lastReview.getTime();
    elapsedDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  }

  let currentState: SM2State | FSRSState | undefined = undefined;

  if (cardUserData.lastReview) {
    if (algorithm == "SM2") {
      currentState = {
        easeFactor: cardUserData.easeFactor,
        repetitions: cardUserData.repetitions,

        reps: cardUserData.reps,
        lapses: cardUserData.lapses,

        interval: cardUserData.interval,
      } as SM2State;
    } else if (algorithm == "FSRS") {
      currentState = {
        stability: cardUserData.stability,
        difficulty: cardUserData.difficulty,

        reps: cardUserData.reps,
        lapses: cardUserData.lapses,

        interval: cardUserData.interval,
      } as FSRSState;
    }
  }

  const reviewResult = reviewCard({
    algorithm,
    grade,
    currentState: currentState,
    elapsedDays,
  } as UnifiedReviewInput);

  await ReviewLog.create({
    userId,
    cardId,
    grade,
    algorithm,
    elapsedDays,
    scheduledDays: reviewResult.interval,
    reviewTime: new Date(),
  });

  Object.assign(cardUserData, reviewResult.newState, {
    nextReview: reviewResult.nextReviewDate,
    lastReview: new Date(),
  });

  await cardUserData.save();

  return {
    success: true,
    message: "Card reviewed successfully.",
  };
};

export class CardController {
  create = async (req: express.Request, res: express.Response) => {
    try {
      const { front, back, deckId } = req.body;
      const userId = req.userId;

      if (!front || !back) {
        return res.status(400).json({
          message: "Error! Front and back of the card are mandatory.",
        });
      }

      const deck = await Deck.findOne({ _id: deckId, createdBy: userId });
      if (!deck) {
        return res.status(404).json({
          message:
            "Error! Deck not found or you don't have permission to add cards.",
        });
      }

      const card = await CardContent.create({
        deckId,
        front,
        back,
        createdBy: userId,
      });

      return res.status(201).json({
        message: "Card created successfully.",
        card,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error! Internal server error.",
      });
    }
  };

  getByDeckId = async (req: express.Request, res: express.Response) => {
    try {
      const { deckId } = req.body;
      const userId = req.userId;

      const deck = await Deck.findOne({ _id: deckId, createdBy: userId });
      if (!deck) {
        return res.status(404).json({ message: "Error! Deck not found." });
      }

      const cards = await CardContent.find({ deckId });

      return res.status(200).json({
        cards,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error! Internal server error.",
      });
    }
  };

  update = async (req: express.Request, res: express.Response) => {
    try {
      const { front, back, id } = req.body;
      const userId = req.userId;

      const card = await CardContent.findOneAndUpdate(
        { _id: id, createdBy: userId },
        { front, back },
        { new: true, runValidators: true },
      );

      if (!card) {
        return res.status(404).json({
          message:
            "Error! Card not found or you don't have permission to change it.",
        });
      }

      return res.status(200).json({
        message: "Card successfully updated.",
        card,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error! Internal server error.",
      });
    }
  };

  delete = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.body;
      const userId = req.userId;

      const card = await CardContent.findOneAndDelete({
        _id: id,
        createdBy: userId,
      });

      if (!card) {
        return res.status(404).json({
          message:
            "Error! Card not found or you don't have permission to change it.",
        });
      }

      await CardUserData.deleteMany({ cardId: id });

      return res.status(200).json({
        message: "Card deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error! Internal server error.",
      });
    }
  };

  review = async (req: express.Request, res: express.Response) => {
    try {
      const { cardId, grade } = req.body;
      const userId = req.userId;

      if (
        !cardId ||
        grade === undefined ||
        grade === null ||
        typeof grade !== "number"
      ) {
        return res
          .status(400)
          .json({ message: "Error! cardId and grade are required." });
      }

      const status = await processCardReview(userId || "", cardId, grade);

      if (status.success) {
        return res.json({ message: status.message });
      } else {
        return res.status(404).json({ message: status.message });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error! Internal server error.",
      });
    }
  };

  getDueCards = async (req: express.Request, res: express.Response) => {
    try {
      const userId = req.userId;
      const { deckId } = req.body;

      const filter: any = {
        userId,
        nextReview: { $lte: new Date() },
      };

      if (deckId) {
        const deckCards = await CardContent.find({ deckId }).select("_id");
        const deckCardIds = deckCards.map((card) => card._id);
        filter.cardId = { $in: deckCardIds };
      }

      const dueCards = await CardUserData.find(filter)
        .sort({ nextReview: 1 })
        .populate("cardId");

      return res.status(200).json(dueCards);
    } catch (error) {
      res.status(500).json({
        message: "Error! Internal server error.",
      });
    }
  };

  getNewCards = async (req: express.Request, res: express.Response) => {
    try {
      const userId = req.userId;
      const { deckId, limit } = req.body;

      const reviewedCardIds = await CardUserData.distinct("cardId", { userId });

      const filter: any = {
        _id: { $nin: reviewedCardIds },
      };

      deckId && (filter.deckId = deckId);

      const newCards = await CardContent.find(filter).limit(limit || 10);

      return res.status(200).json(newCards);
    } catch (error) {
      res.status(500).json({
        message: "Error! Internal server error.",
      });
    }
  };
}
