import express from "express";

import { cacheHeadersMiddleware } from "talk-server/app/middleware/cacheHeaders";
import {
  CSPTenantMiddleware,
  cspTenantMiddleware,
} from "talk-server/app/middleware/csp/tenant";
import { tenantMiddleware } from "talk-server/app/middleware/tenant";
import TenantCache from "talk-server/services/tenant/cache";

export interface ClientTargetHandlerOptions {
  /**
   * view is the name of the template to render.
   */
  view: string;

  /**
   * cacheDuration is the cache duration that a given request should be cached for.
   */
  cacheDuration?: string | false;

  csp?: CSPTenantMiddleware;

  tenantCache?: TenantCache;

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
  csp,
  tenantCache,
}: ClientTargetHandlerOptions) {
  // Create a router.
  const router = express.Router();

  // If the tenantCache is provided, then we can attach the tenant middleware
  // and the cspMiddleware.
  if (tenantCache) {
    router.use(tenantMiddleware({ cache: tenantCache }));
    router.use(cspTenantMiddleware(csp));
  }

  router.use(cacheHeadersMiddleware(cacheDuration));

  router.get("/", (req, res) => res.render(view, { staticURI }));

  return router;
}
