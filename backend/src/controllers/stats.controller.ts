import * as express from "express";
import mongoose from "mongoose";
import ReviewLog from "../models/ReviewLog.js";

export class StatsController {
  getUserStatistics = async (req: express.Request, res: express.Response) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.userId);

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const [totalReviews, reviewsToday, gradeBreakdownRaw, uniqueDaysRaw] =
        await Promise.all([
          ReviewLog.countDocuments({ userId }),

          ReviewLog.countDocuments({
            userId,
            reviewTime: { $gte: startOfToday },
          }),

          ReviewLog.aggregate([
            { $match: { userId } },
            { $group: { _id: "$grade", count: { $sum: 1 } } },
          ]),

          ReviewLog.aggregate([
            { $match: { userId } },
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$reviewTime" },
                },
              },
            },
            { $sort: { _id: -1 } },
          ]),
        ]);

      const gradeBreakdown: Record<number | string, number> = {};
      gradeBreakdownRaw.forEach((item) => {
        gradeBreakdown[item._id] = item.count;
      });

      const dayStrings = uniqueDaysRaw.map((d) => d._id);
      let streak = 0;

      if (dayStrings.length > 0) {
        let checkDate = new Date();
        let dateStr = checkDate.toISOString().split("T")[0];

        if (!dayStrings.includes(dateStr)) {
          checkDate.setDate(checkDate.getDate() - 1);
          dateStr = checkDate.toISOString().split("T")[0];
        }

        while (dayStrings.includes(dateStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
          dateStr = checkDate.toISOString().split("T")[0];
        }
      }

      return res.status(200).json({
        totalReviews,
        reviewsToday,
        gradeBreakdown,
        streak,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error! Internal server error.",
      });
    }
  };
}
