import express from "express";

import { AppOptions } from "coral-server/app";
import { countHandler } from "coral-server/app/handlers";
import { cacheHeadersMiddleware } from "coral-server/app/middleware/cacheHeaders";

export function createStoryRouter(app: AppOptions) {
  const router = express.Router();

  // TODO: (cvle) make caching time configurable?
  router.get("/count.js", cacheHeadersMiddleware("2m"), countHandler(app));
  return router;
}
