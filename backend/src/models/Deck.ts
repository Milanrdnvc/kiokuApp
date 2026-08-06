import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Deck = new Schema({
  name: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Deck", Deck, "decks");
