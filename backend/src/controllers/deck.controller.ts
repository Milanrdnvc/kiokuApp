import * as express from "express";
import Deck from "../models/Deck";
import UserDeckSettings from "../models/UserDeckSettings";
import CardContent from "../models/CardContent";
import CardUserData from "../models/CardUserData";

export class DeckController {
  create = async (req: express.Request, res: express.Response) => {
    try {
      const { name } = req.body;
      const userId = req.userId;

      const deck = await Deck.create({
        name,
        createdBy: userId,
      });

      const settings = await UserDeckSettings.create({
        userId,
        deckId: deck._id,
        desiredRetention: 0.9,
        newCardsPerDay: 10,
        algorithm: "SM2",
      });

      return res.status(201).json({
        message: "Deck created successfully.",
        deck,
        settings,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error! Internal server error.",
      });
    }
  };

  getAll = async (req: express.Request, res: express.Response) => {
    try {
      const userId = req.userId;

      const userDecks = await UserDeckSettings.find({ userId }).populate(
        "deckId",
      );

      return res.status(200).json(userDecks);
    } catch (error) {
      res.status(500).json({
        message: "Error! Internal server error.",
      });
    }
  };

  getById = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.body;
      const userId = req.userId;

      const settings = await UserDeckSettings.findOne({
        userId,
        deckId: id,
      }).populate("deckId");

      if (!settings) {
        return res.status(404).json({ message: "Error! Deck not found." });
      }

      return res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({
        message: "Error! Internal server error.",
      });
    }
  };

  update = async (req: express.Request, res: express.Response) => {
    try {
      const { id, name, desiredRetention, newCardsPerDay, algorithm } =
        req.body;

      const userId = req.userId;

      const currentSettings = await UserDeckSettings.findOne({
        userId,
        deckId: id,
      });

      if (!currentSettings) {
        return res
          .status(404)
          .json({ message: "Error! Settings for deck not found." });
      }

      if (algorithm && algorithm !== currentSettings.algorithm) {
        const deckCards = await CardContent.find({ deckId: id }).select("_id");
        const cardIds = deckCards.map((card) => card._id);

        const hasStartedLearning = await CardUserData.exists({
          userId,
          cardId: { $in: cardIds },
        });

        if (hasStartedLearning) {
          return res.status(400).json({
            message:
              "Error! Cannot change the algorithm after a user has already started learning this deck.",
          });
        }
      }

      let updatedDeck = null;
      if (name) {
        updatedDeck = await Deck.findOneAndUpdate(
          { _id: id, createdBy: userId },
          { name },
          { new: true, runValidators: true },
        );
      }

      if (!updatedDeck) {
        updatedDeck = await Deck.findById(id);
      }

      const settings = await UserDeckSettings.findOneAndUpdate(
        { userId, deckId: id },
        { algorithm, newCardsPerDay, desiredRetention },
        { new: true, runValidators: true },
      );

      return res.status(200).json({
        message: "Deck successfully updated.",
        deck: updatedDeck,
        settings,
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

      const deck = await Deck.findOneAndDelete({ _id: id, createdBy: userId });

      if (!deck) {
        return res.status(404).json({
          message: "Error! Deck not found or you can't delete it.",
        });
      }

      await UserDeckSettings.deleteOne({ deckId: id });

      const cards = await CardContent.find({ deckId: id }).select("_id");
      const cardIds = cards.map((card) => card._id);

      if (cardIds.length > 0) {
        await CardUserData.deleteMany({ cardId: { $in: cardIds } });
        await CardContent.deleteMany({ deckId: id });
      }

      return res.status(200).json({
        message: "Deck deleted successfully.",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error! Internal server error.",
      });
    }
  };
}
