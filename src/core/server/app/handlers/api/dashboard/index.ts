import { AppOptions } from "coral-server/app";
import {
  retrieveDailyCommentTotal,
  retrieveDailyStaffCommentTotal,
} from "coral-server/services/comments/stats";
import { retrieveNewCommentersCount } from "coral-server/services/users";

import { RequestHandler } from "coral-server/types/express";

type StatsOptions = Pick<AppOptions, "redis">;

export const dailyCommentStatsHandler = ({
  redis,
}: StatsOptions): RequestHandler => {
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

export const dailyNewCommenterStatsHandler = ({
  redis,
}: StatsOptions): RequestHandler => {
  return async (req, res, next) => {
    // Tenant is guaranteed at this point.
    const coral = req.coral!;

    const tenant = coral.tenant!;

    try {
      const newCommenters = await retrieveNewCommentersCount(
        redis,
        tenant,
        coral.now
      );
      return res.json({
        commenters: {
          today: newCommenters,
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
