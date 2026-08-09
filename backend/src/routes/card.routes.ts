import express from "express";
import { protect } from "../middlewares/auth.middleware";
import { CardController } from "../controllers/card.controller";

const cardRouter = express.Router();

cardRouter.use(protect);

cardRouter
  .route("/create")
  .post((req, res) => new CardController().create(req, res));

cardRouter
  .route("/getByDeckId")
  .post((req, res) => new CardController().getByDeckId(req, res));

cardRouter
  .route("/update")
  .post((req, res) => new CardController().update(req, res));

cardRouter
  .route("/delete")
  .post((req, res) => new CardController().delete(req, res));

cardRouter
  .route("/review")
  .post((req, res) => new CardController().review(req, res));

cardRouter
  .route("/getDueCards")
  .post((req, res) => new CardController().getDueCards(req, res));

cardRouter
  .route("/getNewCards")
  .post((req, res) => new CardController().getNewCards(req, res));

export default cardRouter;
