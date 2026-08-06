import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
  },
  streakBeginning: {
    type: Date,
  },
  streakLength: {
    type: Number,
  },
});

export default mongoose.model("User", User, "users");
