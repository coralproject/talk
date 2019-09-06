import cookies from "cookie-parser";
import express, { Router } from "express";
import { register } from "prom-client";

import { LanguageCode } from "coral-common/helpers/i18n/locales";
import { AppOptions } from "coral-server/app";
import { noCacheMiddleware } from "coral-server/app/middleware/cacheHeaders";
import playground from "coral-server/app/middleware/playground";
import { RouterOptions } from "coral-server/app/router/types";
import logger from "coral-server/logger";

import { basicAuth } from "../middleware/basicAuth";
import { createAPIRouter } from "./api";
import { mountClientRoutes } from "./client";

export function createRouter(app: AppOptions, options: RouterOptions) {
  // Create a router.
  const router = express.Router();

  // Attach the API router.
  router.use(
    "/api",
    noCacheMiddleware,
    cookies(),
    createAPIRouter(app, options)
  );

  // Attach the GraphiQL if enabled.
  if (app.config.get("enable_graphiql")) {
    attachGraphiQL(router, app);
  }

  if (!options.disableClientRoutes) {
    mountClientRoutes(router, {
      defaultLocale: app.config.get("default_locale") as LanguageCode,
      // When mounting client routes, we need to provide a staticURI even when
      // not provided to the default current domain relative "/".
      staticURI: app.config.get("static_uri") || "/",
      tenantCache: app.tenantCache,
    });
  } else {
    logger.warn("client routes are disabled");
  }

  if (app.metrics) {
    // Add basic auth if provided.
    const username = app.config.get("metrics_username");
    const password = app.config.get("metrics_password");
    if (username && password) {
      router.use("/metrics", basicAuth(username, password));
      logger.info("adding authentication to metrics endpoint");
    } else {
      logger.info(
        "not adding authentication to metrics endpoint, credentials not provided"
      );
    }

    router.get("/metrics", noCacheMiddleware, (req, res) => {
      res.set("Content-Type", register.contentType);
      res.end(register.metrics());
    });
    logger.info({ path: "/metrics" }, "mounting metrics path on app");
  }

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

  // GraphiQL
  router.get(
    "/graphiql",
    playground({
      endpoint: "/api/graphql",
      subscriptionEndpoint: "/api/graphql/live",
    })
  );
}
