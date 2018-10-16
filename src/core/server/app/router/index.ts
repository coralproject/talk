import cors from "cors";
import express, { Router } from "express";

import { AppOptions } from "talk-server/app";
import {
  cacheHeadersMiddleware,
  noCacheMiddleware,
} from "talk-server/app/middleware/cacheHeaders";
import { errorHandler } from "talk-server/app/middleware/error";
import { installedMiddleware } from "talk-server/app/middleware/installed";
import { accessLogger, errorLogger } from "talk-server/app/middleware/logging";
import { notFoundMiddleware } from "talk-server/app/middleware/notFound";
import playground from "talk-server/app/middleware/playground";
import { serveStatic } from "talk-server/app/middleware/serveStatic";
import logger from "talk-server/logger";

import { createAPIRouter } from "./api";
import { createClientTargetRouter } from "./client";
import { RouterOptions } from "./types";

export async function createRouter(app: AppOptions, options: RouterOptions) {
  // Create a router.
  const router = express.Router();

  // Logging
  router.use(accessLogger);

  // Enable CORS headers for media assets, font's require them.
  router.use("/assets/media", cors());

  // Static Files
  router.use("/assets", cacheHeadersMiddleware("1w"), serveStatic);

  // Mount the API.
  router.use("/api", noCacheMiddleware, await createAPIRouter(app, options));

  // Attach the GraphiQL if enabled.
  if (app.config.get("enable_graphiql")) {
    attachGraphiQL(router, app);
  }

  const staticURI = app.config.get("static_uri");

  // Add the embed targets.
  router.use(
    "/embed/stream",
    createClientTargetRouter({ staticURI, view: "stream" })
  );
  router.use(
    "/embed/auth",
    createClientTargetRouter({ staticURI, view: "auth", cacheDuration: false })
  );

  // Add the standalone targets.
  router.use(
    "/admin",
    // If we aren't already installed, redirect the user to the install page.
    installedMiddleware({
      tenantCache: app.tenantCache,
    }),
    createClientTargetRouter({ staticURI, view: "admin", cacheDuration: false })
  );
  router.use(
    "/install",
    // If we're already installed, redirect the user to the admin page.
    installedMiddleware({
      tenantCache: app.tenantCache,
      redirectIfInstalled: true,
      redirectURL: "/admin",
    }),
    createClientTargetRouter({
      staticURI,
      view: "install",
      cacheDuration: false,
    })
  );

  // Handle the root path.
  router.get(
    "/",
    // Redirect the user to the install page if they are not, otherwise redirect
    // them to the admin.
    installedMiddleware({ tenantCache: app.tenantCache }),
    (req, res, next) => res.redirect("/admin")
  );

  // Error Handling
  router.use(notFoundMiddleware);
  router.use(errorLogger);
  router.use(errorHandler);

  return router;
}

/**
 * attachGraphiQL will attach the GraphiQL routes to the router.
 *
 * @param router the router to attach the GraphiQL routes to
 * @param app the application to read the configuration from
 */
function attachGraphiQL(router: Router, app: AppOptions) {
  if (app.config.get("env") === "production") {
    logger.warn(
      "it is not recommended to have enable_graphiql enabled while in production mode as it requires introspection queries to be enabled"
    );
  }

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
