import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/kiokuApp");
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("db connection ok");
});

app.listen(4000, () => console.log("Express running on port 4000!"));
