import express from "express";
import passport from "passport";

import { AppOptions } from "coral-server/app";
import { externalMediaHandler, oembedHandler } from "coral-server/app/handlers";
import {
  apolloGraphQLMiddleware,
  authenticate,
  corsWhitelisted,
  cspSiteMiddleware,
  JSONErrorHandler,
  jsonMiddleware,
  loggedInMiddleware,
  notFoundMiddleware,
  persistedQueryMiddleware,
  roleMiddleware,
  tenantMiddleware,
} from "coral-server/app/middleware";
import { STAFF_ROLES } from "coral-server/models/user/constants";

import { createNewAccountRouter } from "./account";
import { createNewAuthRouter } from "./auth";
import { createCommentRouter } from "./comment";
import { createDashboardRouter } from "./dashboard";
import { createNewInstallRouter } from "./install";
import { createJobStatusRouter } from "./jobStatus";
import { createRemoteMediaRouter } from "./remoteMedia";
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

  // Installation router.
  router.use("/install", createNewInstallRouter(app));

  // Tenant identification middleware. All requests going past this point can
  // only proceed if there is a valid Tenant for the hostname.
  router.use(tenantMiddleware({ mongo: app.mongo, cache: app.tenantCache }));

  // We don't need auth for the story router, so mount it earlier.
  router.use("/story", createStoryRouter(app));
  router.use("/comment", createCommentRouter(app));

  // Setup Passport middleware.
  router.use(passport.initialize());

  // Create the auth router.
  router.use(
    "/auth",
    corsWhitelisted(app.mongo),
    createNewAuthRouter(app, options)
  );
  router.use("/account", createNewAccountRouter(app, options));
  router.use("/user", createNewUserRouter(app));

  // Configure the GraphQL route middleware.
  router.use(
    "/graphql",
    corsWhitelisted(app.mongo),
    authenticate(options.passport),
    jsonMiddleware(app.config.get("max_request_size")),
    persistedQueryMiddleware(app)
  );

  // Attach the GraphQL router (which will be mounted on the same path).
  router.use(apolloGraphQLMiddleware(app));

  router.use(
    "/dashboard",
    authenticate(options.passport),
    loggedInMiddleware,
    roleMiddleware(STAFF_ROLES),
    createDashboardRouter(app)
  );
  router.use(
    "/remote-media",
    authenticate(options.passport),
    loggedInMiddleware,
    createRemoteMediaRouter(app)
  );
  router.get("/oembed", cspSiteMiddleware(app), oembedHandler(app));
  router.get(
    "/external-media",
    cspSiteMiddleware(app),
    externalMediaHandler(app)
  );

  router.use(
    "/jobStatus",
    authenticate(options.passport),
    loggedInMiddleware,
    roleMiddleware(STAFF_ROLES),
    jsonMiddleware(app.config.get("max_request_size")),
    createJobStatusRouter(app)
  );

  // General API error handler.
  router.use(notFoundMiddleware);
  router.use(JSONErrorHandler(app));

  return router;
}
