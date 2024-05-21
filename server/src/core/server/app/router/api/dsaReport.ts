import { AppOptions } from "coral-server/app";
import { reportDownloadHandler } from "coral-server/app/handlers";
import { userLimiterMiddleware } from "coral-server/app/middleware/userLimiter";

import { createAPIRouter } from "./helpers";

export function createDSAReportRouter(app: AppOptions) {
  const router = createAPIRouter({ cacheDuration: "30s" });

  router.use(userLimiterMiddleware(app));

  router.get("/reportDownload", reportDownloadHandler(app));

  return router;
}
