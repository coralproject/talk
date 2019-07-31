import express from "express";
import passport from "passport";

import { AppOptions } from "coral-server/app";
import {
  graphQLHandler,
  healthHandler,
  installHandler,
  versionHandler,
} from "coral-server/app/handlers";
import { JSONErrorHandler } from "coral-server/app/middleware/error";
import { jsonMiddleware } from "coral-server/app/middleware/json";
import { errorLogger } from "coral-server/app/middleware/logging";
import { notFoundMiddleware } from "coral-server/app/middleware/notFound";
import { authenticate } from "coral-server/app/middleware/passport";
import { tenantMiddleware } from "coral-server/app/middleware/tenant";

import { createNewAccountRouter } from "./account";
import { createNewAuthRouter } from "./auth";

export interface RouterOptions {
  /**
   * passport is the instance of the Authenticator that can be used to create
   * and mount new authentication middleware.
   */
  passport: passport.Authenticator;
}

export function createAPIRouter(app: AppOptions, options: RouterOptions) {
  // Create a router.
  const router = express.Router();

  // Configure the version route.
  router.get("/version", versionHandler);

  // Configure the Health route.
  router.get("/health", healthHandler);

  // Installation middleware.
  router.use(
    "/install",
    jsonMiddleware,
    tenantMiddleware({ cache: app.tenantCache, passNoTenant: true }),
    installHandler(app)
  );

  // Tenant identification middleware. All requests going past this point can
  // only proceed if there is a valid Tenant for the hostname.
  router.use(tenantMiddleware({ cache: app.tenantCache }));

  // Setup Passport middleware.
  router.use(passport.initialize());

  // Create the auth router.
  router.use("/auth", createNewAuthRouter(app, options));
  router.use("/account", createNewAccountRouter(app, options));

  // Configure the GraphQL route.
  router.use(
    "/graphql",
    authenticate(options.passport),
    jsonMiddleware,
    graphQLHandler(app)
  );

  // General API error handler.
  router.use(notFoundMiddleware);
  router.use(errorLogger);
  router.use(JSONErrorHandler(app.i18n));

  return router;
}
