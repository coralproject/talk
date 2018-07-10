import express from "express";
import passport from "passport";

import tenantMiddleware from "talk-server/app/middleware/tenant";
import managementGraphMiddleware from "talk-server/graph/management/middleware";
import tenantGraphMiddleware from "talk-server/graph/tenant/middleware";

import { signup } from "talk-server/app/handlers/auth/local";
import { authenticate } from "talk-server/app/middleware/passport";
import { AppOptions } from "./index";
import playground from "./middleware/playground";

async function createManagementRouter(app: AppOptions, options: RouterOptions) {
  const router = express.Router();

  // Management API
  router.use(
    "/graphql",
    express.json(),
    await managementGraphMiddleware(
      app.schemas.management,
      app.config,
      app.mongo
    )
  );

  return router;
}

async function createTenantRouter(app: AppOptions, options: RouterOptions) {
  const router = express.Router();

  // Tenant identification middleware.
  router.use(tenantMiddleware({ db: app.mongo }));

  router.use(options.passport.initialize());
  router.use(
    "/auth/local",
    express.json(),
    authenticate(options.passport, "local")
  );
  router.use("/auth/local/signup", express.json(), signup({ db: app.mongo }));
  router.use("/auth/oidc", authenticate(options.passport, "oidc"));
  router.use("/auth/oidc/callback", authenticate(options.passport, "oidc"));
  // router.use("/auth/google", options.passport.authenticate("google"));
  // router.use("/auth/google/callback", options.passport.authenticate("google"));
  // router.use("/auth/facebook", options.passport.authenticate("facebook"));
  // router.use("/auth/facebook/callback", options.passport.authenticate("facebook"));

  // Tenant API
  router.use(
    "/graphql",
    express.json(),
    await tenantGraphMiddleware(app.schemas.tenant, app.config, app.mongo)
  );

  return router;
}

async function createAPIRouter(app: AppOptions, options: RouterOptions) {
  // Create a router.
  const router = express.Router();

  // Configure the tenant routes.
  router.use("/tenant", await createTenantRouter(app, options));

  // Configure the management routes.
  router.use("/management", await createManagementRouter(app, options));

  return router;
}

export interface RouterOptions {
  /**
   * passport is the instance of the Authenticator that can be used to create
   * and mount new authentication middleware.
   */
  passport: passport.Authenticator;
}

export async function createRouter(app: AppOptions, options: RouterOptions) {
  // Create a router.
  const router = express.Router();

  router.use("/api", await createAPIRouter(app, options));

  if (app.config.get("env") === "development") {
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
