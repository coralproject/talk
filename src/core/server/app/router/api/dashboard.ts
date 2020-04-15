import { AppOptions } from "coral-server/app";

import {
  dailyCommentStatsHandler,
  dailyNewCommenterStatsHandler,
  hourlyCommentsStatsHandler,
  hourlyNewCommentersStatsHandler,
  topCommentedStoriesStatsHandler,
} from "coral-server/app/handlers/api/dashboard";
import { RequestLimiter } from "coral-server/app/request/limiter";
import { RequestHandler } from "coral-server/types/express";
import { createAPIRouter } from "./helpers";

type LimiterOptions = Pick<AppOptions, "redis" | "config">;

const requestLimiter = ({ redis, config }: LimiterOptions): RequestHandler => {
  return async (req, res, next) => {
    try {
      const userIDLimiter = new RequestLimiter({
        redis,
        ttl: "1m",
        max: 5,
        prefix: "userID",
        config,
      });
      await userIDLimiter.test(req, req.user!.id);
      return next();
    } catch (err) {
      return next(err);
    }
  };
};

export function createDashboardRouter(app: AppOptions) {
  const router = createAPIRouter();
  router.use(requestLimiter(app));

  router.get("/daily-comments", dailyCommentStatsHandler(app));
  router.get("/hourly-comments", hourlyCommentsStatsHandler(app));
  router.get("/daily-commenters", dailyNewCommenterStatsHandler(app));
  router.get("/hourly-commenters", hourlyNewCommentersStatsHandler(app));
  router.get("/top-stories", topCommentedStoriesStatsHandler(app));

  return router;
}
