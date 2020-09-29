import bytes from "bytes";
import { Router } from "express";

import { installCheckHandler, installHandler } from "coral-server/app/handlers";
import { jsonMiddleware } from "coral-server/app/middleware/json";
import { tenantMiddleware } from "coral-server/app/middleware/tenant";

import { createAPIRouter } from "./helpers";

// REQUEST_MAX is the maximum request size for routes on this router.
const REQUEST_MAX = bytes("100kb");

export function createNewInstallRouter(): Router {
  // Create a router.
  const router = createAPIRouter();

  // Allow the tenant to be passed on installations.
  router.use(tenantMiddleware({ passNoTenant: true }));

  router.get("/", installCheckHandler());
  router.post("/", jsonMiddleware(REQUEST_MAX), installHandler());

  return router;
}
