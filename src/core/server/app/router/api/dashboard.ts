import { AppOptions } from "coral-server/app";

import { dailyCommentStatsHandler } from "coral-server/app/handlers/api/dashboard";
import { createAPIRouter } from "./helpers";

export function createDashboardRouter(app: AppOptions) {
  const router = createAPIRouter();

  router.get("/comments", dailyCommentStatsHandler(app));

  return router;
}
