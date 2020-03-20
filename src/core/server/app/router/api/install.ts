import { Router } from "express";

import { AppOptions } from "coral-server/app";
import { installCheckHandler, installHandler } from "coral-server/app/handlers";
import { jsonMiddleware } from "coral-server/app/middleware/json";
import { tenantMiddleware } from "coral-server/app/middleware/tenant";

import { createAPIRouter } from "./helpers";

export function createNewInstallRouter(app: AppOptions): Router {
  // Create a router.
  const router = createAPIRouter();

  router.get(
    "/",
    tenantMiddleware({ cache: app.tenantCache, passNoTenant: true }),
    installCheckHandler(app)
  );
  router.post(
    "/",
    jsonMiddleware,
    tenantMiddleware({ cache: app.tenantCache, passNoTenant: true }),
    installHandler(app)
  );

  return router;
}
