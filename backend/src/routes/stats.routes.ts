import express from "express";
import { StatsController } from "../controllers/stats.controller";
import { protect } from "../middlewares/auth.middleware";

const statsRouter = express.Router();

statsRouter.use(protect);

statsRouter
  .route("/getUserStatistics")
  .get((req, res) => new StatsController().getUserStatistics(req, res));

export default statsRouter;
