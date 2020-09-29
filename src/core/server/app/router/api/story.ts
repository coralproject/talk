import { container } from "tsyringe";

import { activeHandler, countHandler } from "coral-server/app/handlers";
import cacheMiddleware from "coral-server/app/middleware/cache";
import { CONFIG, Config } from "coral-server/config";
import { REDIS, Redis } from "coral-server/services/redis";

import { createAPIRouter } from "./helpers";

export function createStoryRouter() {
  // TODO: Replace with DI.
  const config = container.resolve<Config>(CONFIG);
  const redis = container.resolve<Redis>(REDIS);

  const cacheDuration = config.get("jsonp_cache_max_age");
  const immutable = config.get("jsonp_cache_immutable");

  const router = createAPIRouter({ cacheDuration, immutable });

  if (config.get("jsonp_response_cache")) {
    router.use(cacheMiddleware(redis, cacheDuration));
  }

  router.get("/count.js", countHandler());
  router.get("/active.js", activeHandler());

  return router;
}
