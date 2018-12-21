import express, { Router } from "express";

import { AppOptions } from "talk-server/app";
import { noCacheMiddleware } from "talk-server/app/middleware/cacheHeaders";
import { installedMiddleware } from "talk-server/app/middleware/installed";
import playground from "talk-server/app/middleware/playground";
import { RouterOptions } from "talk-server/app/router/types";
import logger from "talk-server/logger";

import { cspTenantMiddleware } from "talk-server/app/middleware/csp/tenant";
import { tenantMiddleware } from "talk-server/app/middleware/tenant";
import { createAPIRouter } from "./api";
import { createClientTargetRouter } from "./client";

export async function createRouter(app: AppOptions, options: RouterOptions) {
  // Create a router.
  const router = express.Router();

  router.use("/api", noCacheMiddleware, await createAPIRouter(app, options));

  // Attach the GraphiQL if enabled.
  if (app.config.get("enable_graphiql")) {
    attachGraphiQL(router, app);
  }

  router.use(tenantMiddleware({ cache: app.tenantCache, passNoTenant: true }));
  router.use(cspTenantMiddleware);

  const staticURI = app.config.get("static_uri");

  // Add the embed targets.
  router.use(
    "/embed/stream",
    createClientTargetRouter({
      staticURI,
      view: "stream",
    })
  );
  router.use(
    "/embed/auth",
    createClientTargetRouter({
      staticURI,
      view: "auth",
      cacheDuration: false,
    })
  );
  router.use(
    "/embed/auth/callback",
    createClientTargetRouter({
      staticURI,
      view: "auth-callback",
      cacheDuration: false,
    })
  );

  // Add the standalone targets.
  router.use(
    "/admin",
    // If we aren't already installed, redirect the user to the install page.
    installedMiddleware({
      tenantCache: app.tenantCache,
    }),
    createClientTargetRouter({
      staticURI,
      view: "admin",
      cacheDuration: false,
    })
  );
  router.use(
    "/install",
    // If we're already installed, redirect the user to the admin page.
    installedMiddleware({
      redirectIfInstalled: true,
      redirectURL: "/admin",
      tenantCache: app.tenantCache,
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
