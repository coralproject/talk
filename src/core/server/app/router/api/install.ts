import express, { Router } from "express";

import { AppOptions } from "coral-server/app";
import { installCheckHandler, installHandler } from "coral-server/app/handlers";
import { jsonMiddleware } from "coral-server/app/middleware/json";
import { tenantMiddleware } from "coral-server/app/middleware/tenant";

export function createNewInstallRouter(app: AppOptions): Router {
  // Create a router.
  const router = express.Router();

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
