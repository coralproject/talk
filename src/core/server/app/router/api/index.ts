import express from "express";
import passport from "passport";

import { AppOptions } from "talk-server/app";
import {
  graphQLHandler,
  installHandler,
  versionHandler,
} from "talk-server/app/handlers";
import { JSONErrorHandler } from "talk-server/app/middleware/error";
import { jsonMiddleware } from "talk-server/app/middleware/json";
import { errorLogger } from "talk-server/app/middleware/logging";
import { notFoundMiddleware } from "talk-server/app/middleware/notFound";
import { authenticate } from "talk-server/app/middleware/passport";
import { tenantMiddleware } from "talk-server/app/middleware/tenant";

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
