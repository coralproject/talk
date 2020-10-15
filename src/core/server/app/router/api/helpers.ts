import express from "express";

import { cacheHeadersMiddleware } from "coral-server/app/middleware/cacheHeaders";

interface Options {
  cacheDuration?: false | string | number;
  immutable?: boolean;
}

export function createAPIRouter({
  cacheDuration = false,
  immutable = false,
}: Options = {}) {
  const router = express.Router();

  // Add the cache headers middleware.
  router.use(cacheHeadersMiddleware({ cacheDuration, immutable }));

  return router;
}
