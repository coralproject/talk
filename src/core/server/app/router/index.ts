import express, { Router } from "express";
import { container } from "tsyringe";

import { StaticConfig } from "coral-common/config";
import { LanguageCode } from "coral-common/helpers/i18n/locales";
import { AppOptions } from "coral-server/app";
import playgroundMiddleware from "coral-server/app/middleware/playground";
import { Config, CONFIG } from "coral-server/config";
import logger from "coral-server/logger";

import { createAPIRouter } from "./api";
import { mountClientRoutes } from "./client";

export function createRouter(app: AppOptions) {
  const config = container.resolve<Config>(CONFIG);

  // Create a router.
  const router = express.Router();

  // Attach the API router.
  router.use("/api", createAPIRouter(app));

  // Attach the GraphiQL if enabled.
  if (config.get("enableGraphiql")) {
    attachGraphiQL(router);
  }

  if (!config.get("disable_client_routes")) {
    // Prepare the client config.get("to") be injected on the page.
    const staticConfig: StaticConfig = {
      // When mounting client routes, we need to provide a staticURI even when
      // not provided to the default current domain relative "/".
      staticURI: config.get("static_uri") || "/",
    };

    // If sentry is configured, then add it's config.get("to") the config.
    if (
      config.get("env") === "production" &&
      config.get("sentry_frontend_key")
    ) {
      staticConfig.reporter = {
        name: "sentry",
        dsn: config.get("sentry_frontend_key"),
      };
    }

    mountClientRoutes(router, {
      analytics: {
        key: config.get("analytics_frontend_key"),
        url: config.get("analytics_data_plane_url"),
        sdk: config.get("analytics_frontend_sdk_url"),
      },
      defaultLocale: config.get("defaultLocale") as LanguageCode,
      staticConfig,
    });
  } else {
    logger.warn("client routes are disabled");
  }

  return router;
}

/**
 * attachGraphiQL will attach the GraphiQL routes to the router.
 *
 * @param router the router to attach the GraphiQL routes to
 */
function attachGraphiQL(router: Router) {
  const config = container.resolve<Config>(CONFIG);

  if (config.get("env") === "production") {
    logger.warn(
      "it is not recommended to have enable_graphiql enabled while in production mode as it requires introspection queries to be enabled"
    );
  }

  // GraphiQL
  router.get(
    "/graphiql",
    playgroundMiddleware({
      endpoint: "/api/graphql",
      subscriptionEndpoint: "/api/graphql/live",
    })
  );
}
