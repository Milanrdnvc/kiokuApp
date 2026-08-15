import mongoose from "mongoose";

import Deck from "../models/Deck";
import Card from "../models/CardContent";

import { hiraganaCards } from "./hiragana";
import { katakanaCards } from "./katakana";
import { n5VocabCards } from "./n5Vocab";
import { n5GrammarCards } from "./n5Grammar";

const MONGO_URI = "mongodb://127.0.0.1:27017/kiokuApp";

interface RawCard {
  front: string;
  back: string;
}

const seedDatabase = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(MONGO_URI);

    // await Deck.deleteMany({});
    // await Card.deleteMany({});

    const decksToCreate = [
      {
        name: "Hiragana",
        cardsData: hiraganaCards,
      },
      {
        name: "Katakana",
        cardsData: katakanaCards,
      },
      {
        name: "JLPT N5 Vocabulary",
        cardsData: n5VocabCards,
      },
      {
        name: "JLPT N5 Grammar",
        cardsData: n5GrammarCards,
      },
    ];

    console.log("Creating decks...");
    for (const deckInfo of decksToCreate) {
      const createdDeck = await Deck.create({
        name: deckInfo.name,
      });

      const cardsToInsert = deckInfo.cardsData.map((card: RawCard) => ({
        deckId: createdDeck._id,
        front: card.front,
        back: card.back,
      }));

      await Card.insertMany(cardsToInsert);
      console.log("Card created.");
    }

    console.log("Database initialized successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error! ", error);
    process.exit(1);
  }
};

seedDatabase();
