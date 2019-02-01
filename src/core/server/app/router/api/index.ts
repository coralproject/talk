import express from "express";
import passport from "passport";

import { AppOptions } from "talk-server/app";
import { versionHandler } from "talk-server/app/handlers/api/version";
import { apiErrorHandler } from "talk-server/app/middleware/error";
import { errorLogger } from "talk-server/app/middleware/logging";
import { notFoundMiddleware } from "talk-server/app/middleware/notFound";

import { createManagementRouter } from "./management";
import { createTenantRouter } from "./tenant";

export interface RouterOptions {
  /**
   * passport is the instance of the Authenticator that can be used to create
   * and mount new authentication middleware.
   */
  passport: passport.Authenticator;
}

export async function createAPIRouter(app: AppOptions, options: RouterOptions) {
  // Create a router.
  const router = express.Router();

  // Configure the tenant routes.
  router.use("/tenant", await createTenantRouter(app, options));

  // Configure the management routes.
  router.use("/management", await createManagementRouter(app));

  // Configure the version route.
  router.get("/version", versionHandler);

  // General API error handler.
  router.use(notFoundMiddleware);
  router.use(errorLogger);
  router.use(apiErrorHandler(app.i18n));

  return router;
}
