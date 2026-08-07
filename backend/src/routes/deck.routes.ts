import express from "express";
import { DeckController } from "../controllers/deck.controller";
import { protect } from "../middlewares/auth.middleware";

const deckRouter = express.Router();

deckRouter.use(protect);

deckRouter
  .route("/create")
  .post((req, res) => new DeckController().create(req, res));

deckRouter
  .route("/delete")
  .post((req, res) => new DeckController().delete(req, res));

deckRouter
  .route("/getAll")
  .get((req, res) => new DeckController().getAll(req, res));

deckRouter
  .route("/getById")
  .post((req, res) => new DeckController().getById(req, res));

deckRouter
  .route("/update")
  .post((req, res) => new DeckController().update(req, res));

export default deckRouter;
