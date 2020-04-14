import { AppOptions } from "coral-server/app";

import {
  dailyCommentStatsHandler,
  dailyNewCommenterStatsHandler,
  hourlyCommentsStatsHandler,
  hourlyNewCommentersStatsHandler,
} from "coral-server/app/handlers/api/dashboard";
import { createAPIRouter } from "./helpers";

export function createDashboardRouter(app: AppOptions) {
  const router = createAPIRouter();

  router.get("/daily-comments", dailyCommentStatsHandler(app));
  router.get("/hourly-comments", hourlyCommentsStatsHandler(app));
  router.get("/daily-commenters", dailyNewCommenterStatsHandler(app));
  router.get("/hourly-commenters", hourlyNewCommentersStatsHandler(app));

  return router;
}
