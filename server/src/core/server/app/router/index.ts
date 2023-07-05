import express, { Router } from "express";

import { StaticConfig } from "coral-common/config";
import { LanguageCode } from "coral-common/helpers/i18n/locales";
import { AppOptions } from "coral-server/app";
import { RouterOptions } from "coral-server/app/router/types";
import { isArchivingEnabled } from "coral-server/data/context";
import logger from "coral-server/logger";

import { createAPIRouter } from "./api";
import { mountClientRoutes } from "./client";

export async function createRouter(app: AppOptions, options: RouterOptions) {
  // Create a router.
  const router = express.Router();

  // Attach the API router.

  // NOTE: disabled cookie support due to ITP/First Party Cookie bugs
  // router.use("/api", cookies(), createAPIRouter(app, options));
  router.use("/api", createAPIRouter(app, options));

  // Attach the GraphiQL if enabled.
  if (app.config.get("enable_graphiql")) {
    attachGraphiQL(router, app);
  }

  // Prepare the client config to be injected on the page.
  const staticConfig: StaticConfig = {
    // When mounting client routes, we need to provide a staticURI even when
    // not provided to the default current domain relative "/".
    staticURI: app.config.get("static_uri"),
    graphQLSubscriptionURI: app.config.get("graphql_subscription_uri") || "",
    featureFlags: [],
    flattenReplies: false,
    forceAdminLocalAuth: app.config.get("force_admin_local_auth"),
    archivingEnabled: isArchivingEnabled(app.config),
    autoArchiveOlderThanMs: app.config.get("auto_archive_older_than"),
  };

  // If sentry is configured, then add it's config to the config.
  if (
    app.config.get("env") === "production" &&
    app.config.get("sentry_frontend_key")
  ) {
    staticConfig.reporter = {
      name: "sentry",
      dsn: app.config.get("sentry_frontend_key"),
    };
  }

  await mountClientRoutes(router, {
    analytics: {
      key: app.config.get("analytics_frontend_key"),
      url: app.config.get("analytics_data_plane_url"),
      sdk: app.config.get("analytics_frontend_sdk_url"),
    },
    defaultLocale: app.config.get("default_locale") as LanguageCode,
    tenantCache: app.tenantCache,
    mongo: app.mongo,
    staticConfig,
    config: app.config,
  });

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
  router.get("/graphiql", (req, res) => {
    res.render("graphiql", {
      version: "1.7.20",
      endpoint: "/api/graphql",
      subscriptionEndpoint: "/api/graphql/live",
    });
  });
}
