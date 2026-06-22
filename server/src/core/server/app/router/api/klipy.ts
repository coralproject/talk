import { AppOptions } from "coral-server/app";
import { klipySearchHandler } from "coral-server/app/handlers/api/klipy";
import { userLimiterMiddleware } from "coral-server/app/middleware";

import { createAPIRouter } from "./helpers";

export function createKlipyRouter(app: AppOptions) {
  const router = createAPIRouter({});

  router.use(userLimiterMiddleware(app));

  router.get("/search", klipySearchHandler(app));

  return router;
}
