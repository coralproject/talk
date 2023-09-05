import { AppOptions } from "coral-server/app";
import {
  dailyUsersMetricsHandler,
  hourlyCommentsMetricsHandler,
  todayMetricsHandler,
  todayStoriesMetricsHandler,
  totalMetricsHandler,
} from "coral-server/app/handlers";
import { userLimiterMiddleware } from "coral-server/app/middleware/userLimiter";

import { createAPIRouter } from "./helpers";

export function createDashboardRouter(app: AppOptions) {
  const router = createAPIRouter({ cacheDuration: "30s" });

  router.use(userLimiterMiddleware(app));

  router.get("/today", todayMetricsHandler(app));
  router.get("/total", totalMetricsHandler(app));
  router.get("/hourly/comments", hourlyCommentsMetricsHandler(app));
  router.get("/daily/users", dailyUsersMetricsHandler(app));
  router.get("/today/stories", todayStoriesMetricsHandler(app));

  return router;
}
