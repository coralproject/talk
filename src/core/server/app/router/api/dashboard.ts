import { AppOptions } from "coral-server/app";

import {
  dailyCommentStatsHandler,
  dailyNewCommenterStatsHandler,
} from "coral-server/app/handlers/api/dashboard";
import { createAPIRouter } from "./helpers";

export function createDashboardRouter(app: AppOptions) {
  const router = createAPIRouter();

  router.get("/comments", dailyCommentStatsHandler(app));
  router.get("/commenters", dailyNewCommenterStatsHandler(app));

  return router;
}
