import express from "express";

import { cacheHeadersMiddleware } from "coral-server/app/middleware/cacheHeaders";

interface Options {
  cache?: false | string;
}

export function createAPIRouter({ cache = false }: Options = {}) {
  const router = express.Router({ mergeParams: true });

  // Add the cache headers middleware.
  router.use(cacheHeadersMiddleware(cache));

  return router;
}
