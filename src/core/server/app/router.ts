import express from "express";
import passport from "passport";

import { signupHandler } from "talk-server/app/handlers/auth/local";
import { apiErrorHandler } from "talk-server/app/middleware/error";
import { errorLogger } from "talk-server/app/middleware/logging";
import { authenticate } from "talk-server/app/middleware/passport";
import tenantMiddleware from "talk-server/app/middleware/tenant";
import managementGraphMiddleware from "talk-server/graph/management/middleware";
import tenantGraphMiddleware from "talk-server/graph/tenant/middleware";

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

  // Setup Passport middleware.
  router.use(options.passport.initialize());

  // Setup auth routes.
  router.use("/auth", createNewAuthRouter(app, options));

  // Tenant API
  router.use(
    "/graphql",
    express.json(),
    await tenantGraphMiddleware(app.schemas.tenant, app.config, app.mongo)
  );

  return router;
}

function createNewAuthRouter(app: AppOptions, options: RouterOptions) {
  const router = express.Router();

  router.post(
    "/local",
    express.json(),
    authenticate(options.passport, "local")
  );
  router.post(
    "/local/signup",
    express.json(),
    signupHandler({ db: app.mongo })
  );
  router.post("/sso", authenticate(options.passport, "sso"));
  router.get("/oidc", authenticate(options.passport, "oidc"));
  router.get("/oidc/callback", authenticate(options.passport, "oidc"));
  // router.get("/google", options.passport.authenticate("google"));
  // router.get("/google/callback", options.passport.authenticate("google"));
  // router.get("/facebook", options.passport.authenticate("facebook"));
  // router.get("/facebook/callback", options.passport.authenticate("facebook"));

  return router;
}

async function createAPIRouter(app: AppOptions, options: RouterOptions) {
  // Create a router.
  const router = express.Router();

  // Configure the tenant routes.
  router.use("/tenant", await createTenantRouter(app, options));

  // Configure the management routes.
  router.use("/management", await createManagementRouter(app, options));

  // General API error handler.
  router.use(errorLogger);
  router.use(apiErrorHandler);

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
