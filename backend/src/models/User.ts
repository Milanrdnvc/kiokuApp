import mongoose, { Document, Types } from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

export interface IUser {
  username: string;
  email: string;
  password: string;
  streakBeginning?: Date | null;
  streakLength?: number | null;
}

export interface IUserMethods {
  comparePassword(enteredPassword: string): Promise<boolean>;
}

export type UserDocument = IUser & IUserMethods & Document<Types.ObjectId>;

const User = new Schema<
  IUser,
  mongoose.Model<IUser, {}, IUserMethods>,
  IUserMethods
>({
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

User.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

User.methods.comparePassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser, mongoose.Model<IUser, {}, IUserMethods>>(
  "User",
  User,
  "users",
);
