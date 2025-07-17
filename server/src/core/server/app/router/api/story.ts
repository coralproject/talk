import bytes from "bytes";

import { AppOptions } from "coral-server/app";
import {
  activeJSONPHandler,
  countHandler,
  countJSONPHandler,
  countsV2Handler,
  ratingsJSONPHandler,
} from "coral-server/app/handlers";
import { jsonMiddleware } from "coral-server/app/middleware";
import cacheMiddleware from "coral-server/app/middleware/cache";
import { authenticate } from "coral-server/app/middleware/passport";
import { roleMiddleware } from "coral-server/app/middleware/role";
import { RouterOptions } from "coral-server/app/router/types";
import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

import { createAPIRouter } from "./helpers";

const REQUEST_MAX = bytes("100kb");

export function createStoryRouter(app: AppOptions, options: RouterOptions) {
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
  router.post(
    "/counts/v2",
    authenticate(options.passport),
    roleMiddleware([GQLUSER_ROLE.ADMIN]),
    jsonMiddleware(REQUEST_MAX),
    countsV2Handler(app)
  );

  return router;
}
