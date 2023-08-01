import { AppOptions } from "coral-server/app";
import {
  commentEmbedJSONPHandler,
  featuredHander,
} from "coral-server/app/handlers";
import { commentEmbedWhitelisted } from "coral-server/app/middleware";
import cacheMiddleware from "coral-server/app/middleware/cache";

import { createAPIRouter } from "./helpers";

export function createCommentRouter(app: AppOptions) {
  const cacheDuration = app.config.get("jsonp_cache_max_age");
  const immutable = app.config.get("jsonp_cache_immutable");

  const router = createAPIRouter({ cacheDuration, immutable });

  if (app.config.get("jsonp_response_cache")) {
    router.use(cacheMiddleware(app.redis, cacheDuration, "commentEmbed"));
  }

  router.get("/featured.js", featuredHander(app));
  router.get(
    "/commentEmbed.js",
    commentEmbedWhitelisted(app),
    commentEmbedJSONPHandler(app)
  );

  return router;
}
