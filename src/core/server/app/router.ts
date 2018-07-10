import express from "express";

import tenantMiddleware from "talk-server/app/middleware/tenant";
import managementGraphMiddleware from "talk-server/graph/management/middleware";
import tenantGraphMiddleware from "talk-server/graph/tenant/middleware";

import { AppOptions } from "./index";
import playground from "./middleware/playground";

async function createManagementRouter(opts: AppOptions) {
  const router = express.Router();

  // Management API
  router.use(
    "/graphql",
    express.json(),
    await managementGraphMiddleware(
      opts.schemas.management,
      opts.config,
      opts.mongo
    )
  );

  return router;
}

async function createTenantRouter(opts: AppOptions) {
  const router = express.Router();

  // Tenant identification middleware.
  router.use(tenantMiddleware({ db: opts.mongo }));

  // Tenant API
  router.use(
    "/graphql",
    express.json(),
    await tenantGraphMiddleware(opts.schemas.tenant, opts.config, opts.mongo)
  );

  return router;
}

async function createAPIRouter(opts: AppOptions) {
  // Create a router.
  const router = express.Router();
  
  // Configure the tenant routes.
  router.use("/tenant", await createTenantRouter(opts));

  // Configure the management routes.
  router.use("/management", await createManagementRouter(opts));

  return router;
}

export async function createRouter(opts: AppOptions) {
  // Create a router.
  const router = express.Router();

  router.use("/api", await createAPIRouter(opts));

  if (opts.config.get("env") === "development") {
    // Tenant GraphiQL
    router.get(
      "/tenant/graphiql",
      playground({
        endpoint: "/api/tenant/graphql",
        subscriptionEndpoint: "/api/tenant/live",
      })
    );

    // Management GraphiQL
    router.get(
      "/management/graphiql",
      playground({
        endpoint: "/api/management/graphql",
        subscriptionEndpoint: "/api/management/live",
      })
    );
  }

  return router;
}
