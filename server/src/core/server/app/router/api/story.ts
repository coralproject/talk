import bytes from "bytes";

import { AppOptions } from "coral-server/app";
import {
  activeJSONPHandler,
  countHandler,
  countJSONPHandler,
  countsV2Handler,
  ratingsJSONPHandler,
} from "coral-server/app/handlers";
import cacheMiddleware from "coral-server/app/middleware/cache";

import { createAPIRouter } from "./helpers";
import { jsonMiddleware } from "coral-server/app/middleware";

const REQUEST_MAX = bytes("100kb");

export function createStoryRouter(app: AppOptions) {
  const redisCacheDuration = app.config.get("jsonp_cache_max_age");
  const immutable = app.config.get("jsonp_cache_immutable");

  const router = createAPIRouter({ cacheDuration: false, immutable });

  if (app.config.get("jsonp_response_cache")) {
    router.use(cacheMiddleware(app.redis, redisCacheDuration, "count"));
  }

  router.get("/count", countHandler(app));
  router.get("/count.js", countJSONPHandler(app));
  router.get("/active.js", activeJSONPHandler(app));
  router.get("/ratings.js", ratingsJSONPHandler(app));

  // v2 of count api
  router.post("/counts/v2", jsonMiddleware(REQUEST_MAX), countsV2Handler(app));

  return router;
}
