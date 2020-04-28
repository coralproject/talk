import { AppOptions } from "coral-server/app";

import {
  banStatusAllTimeHandler,
  bansTodayHandler,
  commentsAllTimeHandler,
  commentsHourlyHandler,
  commentsTodayHandler,
  rejectedAllTimeHandler,
  rejectedTodayHandler,
  signupsTodayHandler,
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

  router.get("/comments/today", attachSite(app), commentsTodayHandler(app));
  router.get("/comments/all", attachSite(app), commentsAllTimeHandler(app));
  router.get("/comments/hourly", attachSite(app), commentsHourlyHandler(app));
  router.get("/bans/today", attachSite(app), bansTodayHandler(app));
  router.get("/rejected/today", attachSite(app), rejectedTodayHandler(app));
  router.get("/signups/today", attachSite(app), signupsTodayHandler(app));
  router.get("/user_ban_status", attachSite(app), banStatusAllTimeHandler(app));
  router.get(
    "/top-stories/today",
    attachSite(app),
    topCommentedStoriesHandler(app)
  );
  router.get("/rejected/all", attachSite(app), rejectedAllTimeHandler(app));

  return router;
}
