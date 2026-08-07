import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ReviewLog = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  algorithm: {
    type: String,
    enum: ["SM2", "FSRS"],
    required: true,
  },
  scheduledDays: {
    type: Number,
    required: true,
  },
  elapsedDays: {
    type: Number,
    required: true,
  },
  reviewTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

ReviewLog.index({ userId: 1, reviewTime: -1 });

export default mongoose.model("ReviewLog", ReviewLog, "reviewLogs");
