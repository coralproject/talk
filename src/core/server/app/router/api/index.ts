import express from "express";
import passport from "passport";

import { AppOptions } from "coral-server/app";
import { graphQLHandler } from "coral-server/app/handlers";
import { oembedHandler } from "coral-server/app/handlers/api/oembed/oembed";
import { cspSiteMiddleware } from "coral-server/app/middleware/csp/tenant";
import { JSONErrorHandler } from "coral-server/app/middleware/error";
import { persistedQueryMiddleware } from "coral-server/app/middleware/graphql";
import { jsonMiddleware } from "coral-server/app/middleware/json";
import { loggedInMiddleware } from "coral-server/app/middleware/loggedIn";
import { notFoundMiddleware } from "coral-server/app/middleware/notFound";
import { authenticate } from "coral-server/app/middleware/passport";
import { roleMiddleware } from "coral-server/app/middleware/role";
import { tenantMiddleware } from "coral-server/app/middleware/tenant";
import { STAFF_ROLES } from "coral-server/models/user/constants";

import { createNewAccountRouter } from "./account";
import { createNewAuthRouter } from "./auth";
import { createDashboardRouter } from "./dashboard";
import { createNewInstallRouter } from "./install";
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
  router.use(tenantMiddleware({ cache: app.tenantCache }));

  // We don't need auth for the story router, so mount it earlier.
  router.use("/story", createStoryRouter(app));

  // Setup Passport middleware.
  router.use(passport.initialize());

  // Create the auth router.
  router.use("/auth", createNewAuthRouter(app, options));
  router.use("/account", createNewAccountRouter(app, options));
  router.use("/user", createNewUserRouter(app));

  router.get("/oembed", cspSiteMiddleware(app), oembedHandler(app));

  // Configure the GraphQL route.
  router.use(
    "/graphql",
    authenticate(options.passport),
    jsonMiddleware(app.config.get("max_request_size")),
    persistedQueryMiddleware(app),
    graphQLHandler(app)
  );

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

  // General API error handler.
  router.use(notFoundMiddleware);
  router.use(JSONErrorHandler(app));

  return router;
}
