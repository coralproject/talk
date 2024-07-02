import { AppOptions } from "coral-server/app";
import { tenorSearchHandler } from "coral-server/app/handlers/api/tenor";
import { userLimiterMiddleware } from "coral-server/app/middleware";

import { createAPIRouter } from "./helpers";

export function createTenorRouter(app: AppOptions) {
  const router = createAPIRouter({});

  router.use(userLimiterMiddleware(app));

  router.get("/search", tenorSearchHandler(app));

  return router;
}
