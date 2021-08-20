import express, { Router } from "express";
import path from "path";

import { StaticConfig } from "coral-common/config";
import { LanguageCode } from "coral-common/helpers/i18n/locales";
import { cacheHeadersMiddleware } from "coral-server/app/middleware/cacheHeaders";
import { cspSiteMiddleware } from "coral-server/app/middleware/csp";
import { installedMiddleware } from "coral-server/app/middleware/installed";
import { tenantMiddleware } from "coral-server/app/middleware/tenant";
import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import logger from "coral-server/logger";
import validFeatureFlagsFilter from "coral-server/models/settings/validFeatureFlagsFilter";
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
   * config is the configuration for the application.
   */
  config: Config;

  /**
   * staticConfig is the static config to be loaded into the template.
   */
  staticConfig: StaticConfig;

  /**
   * defaultLocale is the configured fallback locale for this installation.
   */
  defaultLocale: LanguageCode;

  /**
   * template is the html template name to use.
   */
  template?: "amp" | "client";

  /**
   * mongo is used when trying to infer a site from the request.
   */
  mongo: MongoContext;

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
   * cacheDuration is the cache duration that a given request should be cached
   * for.
   */
  cacheDuration?: string | false;

  /**
   * disableFraming when true will prevent the page from being placed inside an
   * iframe.
   */
  disableFraming?: true;
}

function createClientTargetRouter(options: ClientTargetHandlerOptions) {
  // Create a router.
  const router = express.Router();

  // Add CSP headers to the request, which only apply when serving HTML content.
  router.use(
    cspSiteMiddleware({
      config: options.config,
      mongo: options.mongo,
      frameAncestorsDeny: options.disableFraming,
    })
  );

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
  staticConfig: StaticConfig;

  config: Config;
  mongo: MongoContext;
}

const clientHandler = ({
  analytics,
  staticConfig: config,
  entrypoint,
  enableCustomCSS,
  enableCustomCSSQuery,
  defaultLocale,
  template: viewTemplate = "client",
}: ClientTargetHandlerOptions): RequestHandler => (req, res, next) => {
  // Grab the locale code from the tenant configuration, if available.
  let locale: LanguageCode = defaultLocale;
  if (req.coral.tenant) {
    locale = req.coral.tenant.locale;
  }

  const featureFlags =
    req.coral.tenant?.featureFlags?.filter(validFeatureFlagsFilter(req.user)) ||
    [];

  res.render(viewTemplate, {
    analytics,
    staticURI: config.staticURI,
    entrypoint,
    enableCustomCSS,
    locale,
    config: {
      ...config,
      featureFlags,
      tenantDomain: req.coral.tenant?.domain,
    },
    customCSSURL: enableCustomCSSQuery ? req.query.customCSSURL : null,
  });
};

function loadEntrypoints(manifestFilename: string) {
  // TODO: (wyattjoh) figure out a better way of referencing paths.
  // Load the entrypoint manifest.
  const manifestFilepath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "..",
    "dist",
    "static",
    manifestFilename
  );

  const entrypoints = Entrypoints.fromFile(manifestFilepath);
  if (!entrypoints) {
    logger.error(
      { manifest: manifestFilepath },
      "could not load the generated manifest, client routes will remain un-mounted"
    );
  }

  return entrypoints;
}

export function mountClientRoutes(
  router: Router,
  { tenantCache, mongo, ...options }: MountClientRouteOptions
) {
  const entrypoints = loadEntrypoints("asset-manifest.json");
  if (!entrypoints) {
    return;
  }

  const embedEntrypoints = loadEntrypoints("embed-asset-manifest.json");
  if (!embedEntrypoints) {
    return;
  }

  // Tenant identification middleware.
  router.use(
    tenantMiddleware({
      mongo: mongo.live,
      cache: tenantCache,
      passNoTenant: true,
    })
  );

  // Add the embed targets.
  router.use(
    "/embed/stream/amp",
    createClientTargetRouter({
      mongo,
      ...options,
      cacheDuration: false,
      entrypoint: embedEntrypoints.get("main"),
      template: "amp",
    })
  );

  router.use(
    "/embed/stream",
    createClientTargetRouter({
      mongo,
      ...options,
      enableCustomCSS: true,
      enableCustomCSSQuery: true,
      entrypoint: entrypoints.get("stream"),
    })
  );

  router.use(
    "/embed/auth",
    createClientTargetRouter({
      mongo,
      ...options,
      cacheDuration: false,
      disableFraming: true,
      entrypoint: entrypoints.get("auth"),
    })
  );

  router.use(
    "/account",
    createClientTargetRouter({
      mongo,
      ...options,
      cacheDuration: false,
      disableFraming: true,
      entrypoint: entrypoints.get("account"),
    })
  );

  router.use(
    "/admin",
    // If we aren't already installed, redirect the user to the install page.
    installedMiddleware(),
    createClientTargetRouter({
      mongo,
      ...options,
      cacheDuration: false,
      disableFraming: true,
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
      mongo,
      ...options,
      cacheDuration: false,
      disableFraming: true,
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
