import { AppOptions } from "coral-server/app";
import {
  retrieveDailyCommentTotal,
  retrieveDailyStaffCommentTotal,
} from "coral-server/services/comments/stats";

import { RequestHandler } from "coral-server/types/express";

type DailyStatsOptions = Pick<AppOptions, "redis">;

export const dailyCommentStatsHandler = ({
  redis,
}: DailyStatsOptions): RequestHandler => {
  return async (req, res, next) => {
    // Tenant is guaranteed at this point.
    const coral = req.coral!;

    const tenant = coral.tenant!;

    try {
      const dailyCommentTotal = await retrieveDailyCommentTotal(
        redis,
        tenant.id,
        coral.now
      );
      const dailyStaffCommentTotal = await retrieveDailyStaffCommentTotal(
        redis,
        tenant.id,
        coral.now
      );
      return res.json({
        comments: {
          total: dailyCommentTotal,
          staff: dailyStaffCommentTotal,
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
