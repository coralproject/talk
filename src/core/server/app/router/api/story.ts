import { AppOptions } from "coral-server/app";
import { activeHandler, countHandler } from "coral-server/app/handlers";
import cacheMiddleware from "coral-server/app/middleware/cache";

import { createAPIRouter } from "./helpers";

export function createStoryRouter(app: AppOptions) {
  const ttl = app.config.get("jsonp_max_age");

  const router = createAPIRouter({ cacheDuration: ttl, immutable: true });

  router.get("/count.js", cacheMiddleware(app.redis, ttl), countHandler(app));
  router.get("/active.js", cacheMiddleware(app.redis, ttl), activeHandler(app));

  return router;
}
