import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserDeckSettings = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  deckId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Deck",
    required: true,
  },
  algorithm: {
    type: String,
    required: true,
    enum: ["SM2", "FSRS"],
    default: "SM2",
  },
  desiredRetention: {
    type: Number,
  },
  newCardsPerDay: {
    type: Number,
  },
});

UserDeckSettings.index({ userId: 1, deckId: 1 }, { unique: true });

export default mongoose.model(
  "UserDeckSettings",
  UserDeckSettings,
  "userDeckSettings",
);
