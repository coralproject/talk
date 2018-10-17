import express from "express";

import { cacheHeadersMiddleware } from "talk-server/app/middleware/cacheHeaders";

export interface ClientTargetHandlerOptions {
  /**
   * view is the name of the template to render.
   */
  view: string;

  /**
   * cacheDuration is the cache duration that a given request should be cached for.
   */
  cacheDuration?: string | false;

  /**
   * staticURI is prepended to the static url's that are included on the static
   * pages.
   */
  staticURI: string;
}

export function createClientTargetRouter({
  staticURI,
  view,
  cacheDuration = "1h",
}: ClientTargetHandlerOptions) {
  // Create a router.
  const router = express.Router();

  router.get("/", cacheHeadersMiddleware(cacheDuration), (req, res) =>
    res.render(view, { staticURI })
  );

  return router;
}
