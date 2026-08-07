import * as express from "express";
import Deck from "../models/Deck";
import CardContent from "../models/CardContent";
import CardUserData from "../models/CardUserData";

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
}
