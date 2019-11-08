import express from "express";
import passport from "passport";

import { AppOptions } from "coral-server/app";
import {
  graphQLHandler,
  healthHandler,
  versionHandler,
} from "coral-server/app/handlers";
import { JSONErrorHandler } from "coral-server/app/middleware/error";
import { persistedQueryMiddleware } from "coral-server/app/middleware/graphql";
import { jsonMiddleware } from "coral-server/app/middleware/json";
import { errorLogger } from "coral-server/app/middleware/logging";
import { notFoundMiddleware } from "coral-server/app/middleware/notFound";
import { authenticate } from "coral-server/app/middleware/passport";
import { tenantMiddleware } from "coral-server/app/middleware/tenant";

import { createNewAccountRouter } from "./account";
import { createNewAuthRouter } from "./auth";
import { createNewInstallRouter } from "./install";
import { createStoryRouter } from "./story";
import { createNewUserRouter } from "./user";

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

  // Installation router.
  router.use("/install", createNewInstallRouter(app));

  // Tenant identification middleware. All requests going past this point can
  // only proceed if there is a valid Tenant for the hostname.
  router.use(tenantMiddleware({ cache: app.tenantCache }));

  // Setup Passport middleware.
  router.use(passport.initialize());

  // Create the auth router.
  router.use("/auth", createNewAuthRouter(app, options));
  router.use("/account", createNewAccountRouter(app, options));
  router.use("/user", createNewUserRouter(app));
  router.use("/story", createStoryRouter(app));

  // Configure the GraphQL route.
  router.use(
    "/graphql",
    authenticate(options.passport),
    jsonMiddleware,
    persistedQueryMiddleware(app),
    graphQLHandler(app)
  );

  // General API error handler.
  router.use(notFoundMiddleware);
  router.use(errorLogger);
  router.use(JSONErrorHandler(app.i18n));

  return router;
}
