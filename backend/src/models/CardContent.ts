import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CardContent = new Schema({
  front: {
    type: String,
    required: true,
  },
  back: {
    type: String,
    required: true,
  },
  deckId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

export default mongoose.model("CardContent", CardContent, "cardContent");
