import { AppOptions } from "coral-server/app";

import {
  commentStatuses,
  dailyBansHandler,
  dailyCommentStatsHandler,
  dailySignupsForWeekHandler,
  dailySignupsHandler,
  hourlyCommentsStatsHandler,
  topCommentedStoriesStatsHandler,
} from "coral-server/app/handlers/api/dashboard";
import { attachSite } from "coral-server/app/middleware/attachSite";

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

  router.get("/daily/comments", attachSite(app), dailyCommentStatsHandler(app));
  router.get("/daily/bans", attachSite(app), dailyBansHandler(app));
  router.get(
    "/hourly/comments",
    attachSite(app),
    hourlyCommentsStatsHandler(app)
  );
  router.get("/daily/new-signups", attachSite(app), dailySignupsHandler(app));
  router.get(
    "/weekly/new-signups",
    attachSite(app),
    dailySignupsForWeekHandler(app)
  );
  router.get(
    "/daily/top-stories",
    attachSite(app),
    topCommentedStoriesStatsHandler(app)
  );
  router.get("/comment-statuses", attachSite(app), commentStatuses);

  return router;
}
