import { AppOptions } from "coral-server/app";

import {
  allTimeCountersHandler,
  commentsHourlyHandler,
  dailySignupsHandler,
  todayCountersHandler,
  topCommentedStoriesHandler,
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

  router.get("/today", attachSite(app), todayCountersHandler(app));
  router.get("/all-time", attachSite(app), allTimeCountersHandler(app));
  router.get(
    "/top-stories-today",
    attachSite(app),
    topCommentedStoriesHandler(app)
  );
  router.get("/hourly-comments", attachSite(app), commentsHourlyHandler(app));
  router.get("/daily-signups", attachSite(app), dailySignupsHandler(app));

  return router;
}
