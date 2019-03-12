import express, { Router } from "express";
import path from "path";

import { AppOptions } from "talk-server/app";
import { noCacheMiddleware } from "talk-server/app/middleware/cacheHeaders";
import { cspTenantMiddleware } from "talk-server/app/middleware/csp/tenant";
import { installedMiddleware } from "talk-server/app/middleware/installed";
import playground from "talk-server/app/middleware/playground";
import { tenantMiddleware } from "talk-server/app/middleware/tenant";
import { RouterOptions } from "talk-server/app/router/types";
import logger from "talk-server/logger";

import Entrypoints from "../helpers/entrypoints";
import { createAPIRouter } from "./api";
import { createClientTargetRouter } from "./client";

export function createRouter(app: AppOptions, options: RouterOptions) {
  // Create a router.
  const router = express.Router();

  // Attach the API router.
  router.use("/api", noCacheMiddleware, createAPIRouter(app, options));

  // Attach the GraphiQL if enabled.
  if (app.config.get("enable_graphiql")) {
    attachGraphiQL(router, app);
  }

  // TODO: (wyattjoh) figure out a better way of referencing paths.
  // Load the entrypoint manifest.
  const manifest = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "..",
    "dist",
    "static",
    "asset-manifest.json"
  );
  const entrypoints = Entrypoints.fromFile(manifest);
  if (entrypoints) {
    // Tenant identification middleware.
    router.use(
      tenantMiddleware({
        cache: app.tenantCache,
        passNoTenant: true,
      })
    );

    // Add CSP headers to the request, which only apply when serving HTML content.
    router.use(cspTenantMiddleware);

    const staticURI = app.config.get("static_uri");

    // Add the embed targets.
    router.use(
      "/embed/stream",
      createClientTargetRouter({
        staticURI,
        enableCustomCSS: true,
        entrypoint: entrypoints.get("stream"),
      })
    );
    router.use(
      "/embed/auth",
      createClientTargetRouter({
        staticURI,
        cacheDuration: false,
        entrypoint: entrypoints.get("auth"),
      })
    );
    router.use(
      "/embed/auth/callback",
      createClientTargetRouter({
        staticURI,
        cacheDuration: false,
        entrypoint: entrypoints.get("authCallback"),
      })
    );

    // Add the standalone targets.
    router.use(
      "/admin",
      // If we aren't already installed, redirect the user to the install page.
      installedMiddleware(),
      createClientTargetRouter({
        staticURI,
        cacheDuration: false,
        entrypoint: entrypoints.get("admin"),
      })
    );
    router.use(
      "/install",
      // If we're already installed, redirect the user to the admin page.
      installedMiddleware({
        redirectIfInstalled: true,
        redirectURL: "/admin",
      }),
      createClientTargetRouter({
        staticURI,
        cacheDuration: false,
        entrypoint: entrypoints.get("install"),
      })
    );

    // Handle the root path.
    router.get(
      "/",
      // Redirect the user to the install page if they are not, otherwise redirect
      // them to the admin.
      installedMiddleware(),
      (req, res, next) => res.redirect("/admin")
    );
  } else {
    logger.warn(
      { manifest },
      "could not load the generated manifest, client routes will remain un-mounted"
    );
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
  router.get("/graphiql", playground({ endpoint: "/api/graphql" }));
}
