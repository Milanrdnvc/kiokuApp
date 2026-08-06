import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CardUserData = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  interval: {
    type: Number,
  },
  nextReview: {
    type: Date,
  },
  lastReview: {
    type: Date,
  },

  // SM-2
  easeFactor: {
    type: Number,
  },
  repetitions: {
    type: Number,
  },

  // FSRS
  stability: {
    type: Number,
  },
  difficulty: {
    type: Number,
  },
});

CardUserData.index({ userId: 1, cardId: 1 }, { unique: true });

export default mongoose.model("CardUserData", CardUserData, "cardUserData");
