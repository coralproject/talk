import express from "express";
import passport from "passport";
import { container } from "tsyringe";

import { AppOptions } from "coral-server/app";
import { externalMediaHandler, oembedHandler } from "coral-server/app/handlers";
import {
  apolloGraphQLMiddleware,
  authenticate,
  cspSiteMiddleware,
  JSONErrorHandler,
  jsonMiddleware,
  loggedInMiddleware,
  notFoundMiddleware,
  persistedQueryMiddleware,
  roleMiddleware,
  tenantMiddleware,
} from "coral-server/app/middleware";
import { Config, CONFIG } from "coral-server/config";
import { STAFF_ROLES } from "coral-server/models/user/constants";

import { createNewAccountRouter } from "./account";
import { createNewAuthRouter } from "./auth";
import { createDashboardRouter } from "./dashboard";
import { createNewInstallRouter } from "./install";
import { createRemoteMediaRouter } from "./remoteMedia";
import { createStoryRouter } from "./story";
import { createNewUserRouter } from "./user";

export function createAPIRouter(app: AppOptions) {
  const config = container.resolve<Config>(CONFIG);

  // Create a router.
  const router = express.Router();

  // Installation router.
  router.use("/install", createNewInstallRouter());

  // Tenant identification middleware. All requests going past this point can
  // only proceed if there is a valid Tenant for the hostname.
  router.use(tenantMiddleware());

  // We don't need auth for the story router, so mount it earlier.
  router.use("/story", createStoryRouter());

  // Setup Passport middleware.
  router.use(passport.initialize());

  // Create the auth router.
  router.use("/auth", createNewAuthRouter());
  router.use("/account", createNewAccountRouter());
  router.use("/user", createNewUserRouter());

  // configure the GraphQL route middleware.
  router.use(
    "/graphql",
    authenticate(),
    jsonMiddleware(config.get("max_request_size")),
    persistedQueryMiddleware(app)
  );

  // Attach the GraphQL router (which will be mounted on the same path).
  router.use(apolloGraphQLMiddleware());

  router.use(
    "/dashboard",
    authenticate(),
    loggedInMiddleware,
    roleMiddleware(STAFF_ROLES),
    createDashboardRouter()
  );
  router.use(
    "/remote-media",
    authenticate(),
    loggedInMiddleware,
    createRemoteMediaRouter()
  );
  router.get("/oembed", cspSiteMiddleware(), oembedHandler());
  router.get("/external-media", cspSiteMiddleware(), externalMediaHandler());

  // General API error handler.
  router.use(notFoundMiddleware);
  router.use(JSONErrorHandler(app));

  return router;
}
