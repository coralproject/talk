import { AppOptions } from "coral-server/app";

import {
  commentStatuses,
  dailyCommentStatsHandler,
  dailySignupsHandler,
  hourlyCommentsStatsHandler,
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
  if (process.env.NODE_ENV !== "development") {
    router.use(requestLimiter(app));
  }

  router.get("/daily/comments", dailyCommentStatsHandler(app));
  router.get("/hourly/comments", hourlyCommentsStatsHandler(app));
  router.get("/daily/new-signups", dailySignupsHandler(app));
  router.get("/daily/top-stories", topCommentedStoriesStatsHandler(app));
  router.get("/comment-statuses", commentStatuses);

  return router;
}
