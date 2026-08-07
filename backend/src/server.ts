import express, { Router } from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/user.routes";
import deckRouter from "./routes/deck.routes";
import cardRouter from "./routes/card.routes";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/kiokuApp");
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("db connection ok");
});

const router = Router();
router.use("/user", userRouter);
router.use("/deck", deckRouter);
router.use("/card", cardRouter);
app.use("/", router);

app.listen(4000, () => console.log("Express running on port 4000!"));
