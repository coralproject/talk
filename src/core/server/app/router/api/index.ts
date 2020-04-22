import express from "express";
import passport from "passport";

import { AppOptions } from "coral-server/app";
import { graphQLHandler } from "coral-server/app/handlers";
import { JSONErrorHandler } from "coral-server/app/middleware/error";
import { persistedQueryMiddleware } from "coral-server/app/middleware/graphql";
import { jsonMiddleware } from "coral-server/app/middleware/json";
import { loggedInMiddleware } from "coral-server/app/middleware/loggedIn";
import { errorLogger } from "coral-server/app/middleware/logging";
import { notFoundMiddleware } from "coral-server/app/middleware/notFound";
import { authenticate } from "coral-server/app/middleware/passport";
import { roleMiddleware } from "coral-server/app/middleware/role";
import { tenantMiddleware } from "coral-server/app/middleware/tenant";

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

import { createNewAccountRouter } from "./account";
import { createNewAuthRouter } from "./auth";
import { createDashboardRouter } from "./dashboard";
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
  const router = express.Router({ mergeParams: true });

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

  // Configure the GraphQL route.
  router.use(
    "/graphql",
    authenticate(options.passport),
    jsonMiddleware,
    persistedQueryMiddleware(app),
    graphQLHandler(app)
  );

  router.use(
    "/dashboard",
    authenticate(options.passport),
    loggedInMiddleware,
    roleMiddleware([
      GQLUSER_ROLE.ADMIN,
      GQLUSER_ROLE.STAFF,
      GQLUSER_ROLE.MODERATOR,
    ]),
    jsonMiddleware,
    createDashboardRouter(app)
  );

  router.use(
    "/dashboard/:siteID",
    authenticate(options.passport),
    loggedInMiddleware,
    roleMiddleware([
      GQLUSER_ROLE.ADMIN,
      GQLUSER_ROLE.STAFF,
      GQLUSER_ROLE.MODERATOR,
    ]),
    jsonMiddleware,
    createDashboardRouter(app)
  );

  // General API error handler.
  router.use(notFoundMiddleware);
  router.use(errorLogger);
  router.use(JSONErrorHandler(app.i18n));

  return router;
}
