import express from "express";

import { cacheHeadersMiddleware } from "talk-server/app/middleware/cacheHeaders";
import { Entrypoint } from "../helpers/entrypoints";

export interface ClientTargetHandlerOptions {
  /**
   * entrypoint is the entrypoint entry to load.
   */
  entrypoint: Entrypoint;

  /**
   * enableCustomCSS will insert the custom CSS into the template if it is
   * available on the Tenant.
   */
  enableCustomCSS?: boolean;

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
  entrypoint,
  enableCustomCSS = false,
  cacheDuration = "1h",
}: ClientTargetHandlerOptions) {
  // Create a router.
  const router = express.Router();

  // Always send the cache headers.
  router.use(cacheHeadersMiddleware(cacheDuration));

  // Wildcard display all the client routes under the provided prefix.
  router.get("/*", (req, res) =>
    res.render("client", { staticURI, entrypoint, enableCustomCSS })
  );

  return router;
}
