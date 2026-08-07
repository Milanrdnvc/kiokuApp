import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Deck = new Schema({
  name: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

export default mongoose.model("Deck", Deck, "decks");
