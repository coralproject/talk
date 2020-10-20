import express, { Router } from "express";
import { Db } from "mongodb";
import path from "path";

import { StaticConfig } from "coral-common/config";
import { LanguageCode } from "coral-common/helpers/i18n/locales";
import { cacheHeadersMiddleware } from "coral-server/app/middleware/cacheHeaders";
import { cspSiteMiddleware } from "coral-server/app/middleware/csp/tenant";
import { installedMiddleware } from "coral-server/app/middleware/installed";
import { tenantMiddleware } from "coral-server/app/middleware/tenant";
import logger from "coral-server/logger";
import { TenantCache } from "coral-server/services/tenant/cache";
import { RequestHandler } from "coral-server/types/express";

import Entrypoints, { Entrypoint } from "../helpers/entrypoints";

export interface ClientTargetHandlerOptions {
  /**
   * analytics contains configuration for frontend analytics from RudderStack.
   */
  analytics: {
    /**
     * key is the Write Key for the frontend integration.
     */
    key: string;

    /**
     * url is the URL to the data plane for your RudderStack deployment.
     */
    url: string;

    /**
     * sdk is the URL to the JS SDK for the RudderStack deployment.
     */
    sdk: string;
  };

  /**
   * config is the static config to be loaded into the template.
   */
  config: StaticConfig;

  /**
   * defaultLocale is the configured fallback locale for this installation.
   */
  defaultLocale: LanguageCode;

  /**
   * mongo is used when trying to infer a site from the request.
   */
  mongo: Db;

  /**
   * entrypoint is the entrypoint entry to load.
   */
  entrypoint: Entrypoint;

  /**
   * enableCustomCSS will insert the custom CSS into the template if it is
   * available on the Tenant.
   */
  enableCustomCSS?: boolean;
  /**
   * enableCustomCSSQuery will insert the custom CSS into the template if it is
   * passed through in a query string
   */
  enableCustomCSSQuery?: boolean;

  /**
   * cacheDuration is the cache duration that a given request should be cached for.
   */
  cacheDuration?: string | false;
}

function createClientTargetRouter(options: ClientTargetHandlerOptions) {
  // Create a router.
  const router = express.Router();

  // Add CSP headers to the request, which only apply when serving HTML content.
  router.use(cspSiteMiddleware(options));

  // Always send the cache headers.
  router.use(cacheHeadersMiddleware({ cacheDuration: options.cacheDuration }));

  // Wildcard display all the client routes under the provided prefix.
  router.get("/*", clientHandler(options));

  return router;
}

interface MountClientRouteOptions {
  analytics: {
    key: string;
    url: string;
    sdk: string;
  };
  defaultLocale: LanguageCode;
  tenantCache: TenantCache;
  config: StaticConfig;
  mongo: Db;
}

const clientHandler = ({
  analytics,
  config,
  entrypoint,
  enableCustomCSS,
  enableCustomCSSQuery,
  defaultLocale,
}: ClientTargetHandlerOptions): RequestHandler => (req, res, next) => {
  // Grab the locale code from the tenant configuration, if available.
  let locale: LanguageCode = defaultLocale;
  if (req.coral.tenant) {
    locale = req.coral.tenant.locale;
  }

  res.render("client", {
    analytics,
    staticURI: config.staticURI,
    entrypoint,
    enableCustomCSS,
    locale,
    config,
    customCSSURL: enableCustomCSSQuery ? req.query.customCSSURL : null,
  });
};

export function mountClientRoutes(
  router: Router,
  { tenantCache, ...options }: MountClientRouteOptions
) {
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
  if (!entrypoints) {
    logger.error(
      { manifest },
      "could not load the generated manifest, client routes will remain un-mounted"
    );
    return;
  }

  // Tenant identification middleware.
  router.use(
    tenantMiddleware({
      cache: tenantCache,
      passNoTenant: true,
    })
  );

  // Add the embed targets.
  router.use(
    "/embed/stream",
    createClientTargetRouter({
      ...options,
      enableCustomCSS: true,
      enableCustomCSSQuery: true,
      entrypoint: entrypoints.get("stream"),
    })
  );
  router.use(
    "/embed/auth/callback",
    createClientTargetRouter({
      ...options,
      cacheDuration: false,
      entrypoint: entrypoints.get("authCallback"),
    })
  );
  router.use(
    "/embed/auth",
    createClientTargetRouter({
      ...options,
      cacheDuration: false,
      entrypoint: entrypoints.get("auth"),
    })
  );

  // Add the standalone targets.
  router.use(
    "/account",
    // If we aren't already installed, redirect the user to the install page.
    installedMiddleware(),
    createClientTargetRouter({
      ...options,
      cacheDuration: false,
      entrypoint: entrypoints.get("account"),
    })
  );
  // Add the standalone targets.
  router.use(
    "/admin",
    // If we aren't already installed, redirect the user to the install page.
    installedMiddleware(),
    createClientTargetRouter({
      ...options,
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
      ...options,
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
}
