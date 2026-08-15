import * as express from "express";
import { Types } from "mongoose";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Deck from "../models/Deck.js";
import UserDeckSettings from "../models/UserDeckSettings.js";

const generateToken = (userId: Types.ObjectId | string): string => {
  return jwt.sign(
    { id: userId.toString() },
    process.env.JWT_SECRET || "secret_key_dev",
    { expiresIn: "7d" },
  );
};

const initializeUserDecks = async (userId: string) => {
  const premadeDecks = await Deck.find({ createdBy: null });

  const userDeckSettings = premadeDecks.map((deck) => ({
    userId,
    deckId: deck._id,
  }));

  await UserDeckSettings.insertMany(userDeckSettings);
};

export class UserController {
  register = async (req: express.Request, res: express.Response) => {
    try {
      const { username, password, email } = req.body;

      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Error! Username or email already exists.",
        });
      }

      const user = await User.create({ username, email, password });

      const token = generateToken(user._id);

      await initializeUserDecks(user._id.toString());

      res.status(201).json({
        message: "Registration successful.",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Error! Internal server error.",
      });
    }
  };

  login = async (req: express.Request, res: express.Response) => {
    try {
      const { usernameOrEmail, password } = req.body;

      const user = await User.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      });
      if (!user) {
        return res.status(401).json({ message: "Error! Wrong credentials." });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Error! Wrong credentials." });
      }

      const token = generateToken(user._id);

      res.status(200).json({
        message: "Login successful.",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Error! Internal server error.",
      });
    }
  };
}
