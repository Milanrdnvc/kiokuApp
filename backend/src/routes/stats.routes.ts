import express from "express";
import { StatsController } from "../controllers/stats.controller";

const statsRoutes = express.Router();

statsRoutes
  .route("/getUserStatistics")
  .get((req, res) => new StatsController().getUserStatistics(req, res));

export default statsRoutes;
