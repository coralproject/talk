import express, { Router } from "express";

import { AppOptions } from "talk-server/app";
import { nocacheMiddleware } from "talk-server/app/middleware/cacheHeaders";
import { installedMiddleware } from "talk-server/app/middleware/installed";
import playground from "talk-server/app/middleware/playground";
import { RouterOptions } from "talk-server/app/router/types";
import logger from "talk-server/logger";

import { createAPIRouter } from "./api";
import { createClientTargetRouter } from "./client";

export async function createRouter(app: AppOptions, options: RouterOptions) {
  // Create a router.
  const router = express.Router();

  router.use("/api", nocacheMiddleware, await createAPIRouter(app, options));

  // Attach the GraphiQL if enabled.
  if (app.config.get("enable_graphiql")) {
    attachGraphiQL(router, app);
  }

  // Add the embed targets.
  router.use("/embed/stream", createClientTargetRouter({ view: "stream" }));
  router.use("/embed/auth", createClientTargetRouter({ view: "auth" }));

  // Add the standalone targets.
  router.use(
    "/admin",
    installedMiddleware({
      tenantCache: app.tenantCache,
    }),
    createClientTargetRouter({ view: "admin" })
  );
  router.use(
    "/install",
    installedMiddleware({
      tenantCache: app.tenantCache,
      redirectIfInstalled: true,
      redirectURL: "/admin",
    }),
    createClientTargetRouter({ view: "install", cacheDuration: "" })
  );

  // if (app.config.get("env") === "development") {
  // } else {
  // }

  router.get(
    "/",
    installedMiddleware({ tenantCache: app.tenantCache }),
    (req, res, next) => {
      res.redirect("/admin");
    }
  );

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
      "enable_graphiql is enabled, but we're in production mode, this is not recommended"
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
