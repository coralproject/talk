import bytes from "bytes";
import { Router } from "express";

import { AppOptions } from "coral-server/app";
import { installCheckHandler, installHandler } from "coral-server/app/handlers";
import { jsonMiddleware } from "coral-server/app/middleware/json";
import { tenantMiddleware } from "coral-server/app/middleware/tenant";

import { createAPIRouter } from "./helpers";

// REQUEST_MAX is the maximum request size for routes on this router.
const REQUEST_MAX = bytes("100kb");

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
    jsonMiddleware(REQUEST_MAX),
    tenantMiddleware({ cache: app.tenantCache, passNoTenant: true }),
    installHandler(app)
  );

  return router;
}
