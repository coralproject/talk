import {
  dailyUsersMetricsHandler,
  hourlyCommentsMetricsHandler,
  todayMetricsHandler,
  todayStoriesMetricsHandler,
  totalMetricsHandler,
} from "coral-server/app/handlers";
import { userLimiterMiddleware } from "coral-server/app/middleware/userLimiter";

import { createAPIRouter } from "./helpers";

export function createDashboardRouter() {
  const router = createAPIRouter({ cacheDuration: "30s" });

  router.use(userLimiterMiddleware());

  router.get("/today", todayMetricsHandler());
  router.get("/total", totalMetricsHandler());
  router.get("/hourly/comments", hourlyCommentsMetricsHandler());
  router.get("/daily/users", dailyUsersMetricsHandler());
  router.get("/today/stories", todayStoriesMetricsHandler());

  return router;
}
