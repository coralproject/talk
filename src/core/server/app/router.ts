import express, { Router } from "express";

import tenantGraphMiddleware from "talk-server/graph/tenant/middleware";
import managementGraphMiddleware from "talk-server/graph/management/middleware";

import { AppOptions } from "./index";
import playground from "./middleware/playground";

async function createManagementRouter(opts: AppOptions) {
  const router = express.Router();

  if (opts.config.get("env") === "development") {
    // GraphiQL
    router.get(
      "/graphiql",
      playground({
        endpoint: "/api/management/graphql",
        subscriptionEndpoint: "/api/management/live",
      })
    );
  }

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

  if (opts.config.get("env") === "development") {
    // GraphiQL
    router.get(
      "/graphiql",
      playground({
        endpoint: "/api/tenant/graphql",
        subscriptionEndpoint: "/api/tenant/live",
      })
    );
  }

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

  return router;
}
