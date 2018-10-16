import express from "express";

import { AppOptions } from "talk-server/app";
import { tenantInstallHandler } from "talk-server/app/handlers/api/tenant/install";
import tenantMiddleware from "talk-server/app/middleware/tenant";
import { RouterOptions } from "talk-server/app/router/types";
import tenantGraphMiddleware from "talk-server/graph/tenant/middleware";

import { tenantContext } from "talk-server/app/middleware/context/tenant";
import { createNewAuthRouter } from "./auth";

export async function createTenantRouter(
  app: AppOptions,
  options: RouterOptions
) {
  const router = express.Router();

  // Tenant setup handler.
  router.use(
    "/install",
    express.json(),
    tenantInstallHandler({
      cache: app.tenantCache,
      redis: app.redis,
      mongo: app.mongo,
    })
  );

  // Tenant identification middleware.
  router.use(tenantMiddleware({ cache: app.tenantCache }));

  // Setup Passport middleware.
  router.use(options.passport.initialize());

  // Setup auth routes.
  router.use("/auth", createNewAuthRouter(app, options));

  // Tenant API
  router.use(
    "/graphql",
    express.json(),
    // Any users may submit their GraphQL requests with authentication, this
    // middleware will unpack their user into the request.
    options.passport.authenticate("jwt", { session: false }),
    tenantContext({
      mongo: app.mongo,
      redis: app.redis,
      queue: app.queue,
    }),
    await tenantGraphMiddleware({
      schema: app.schemas.tenant,
      config: app.config,
    })
  );

  return router;
}
