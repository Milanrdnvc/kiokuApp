import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CardUserData = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    cardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CardContent",
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

    reps: {
      type: Number,
    },
    lapses: {
      type: Number,
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
  },
  {
    timestamps: true,
  },
);

CardUserData.index({ userId: 1, cardId: 1 }, { unique: true });

CardUserData.index({ userId: 1, nextReview: 1 });

export default mongoose.model("CardUserData", CardUserData, "cardUserData");
