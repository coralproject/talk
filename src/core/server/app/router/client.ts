import cors from "cors";
import express, { Router } from "express";

import { EmbedBootstrapConfig, StaticConfig } from "coral-common/config";
import { LanguageCode } from "coral-common/helpers/i18n/locales";
import { cacheHeadersMiddleware } from "coral-server/app/middleware/cacheHeaders";
import { cspSiteMiddleware } from "coral-server/app/middleware/csp";
import { installedMiddleware } from "coral-server/app/middleware/installed";
import { tenantMiddleware } from "coral-server/app/middleware/tenant";
import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { TenantNotFoundError } from "coral-server/errors";
import validFeatureFlagsFilter from "coral-server/models/settings/validFeatureFlagsFilter";
import { TenantCache } from "coral-server/services/tenant/cache";
import {
  Request,
  RequestHandler,
  TenantCoralRequest,
} from "coral-server/types/express";

import ManifestLoader, {
  createManifestLoader,
  EntrypointLoader,
} from "../helpers/manifestLoader";

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
   * entrypointLoader is the Loader to the entrypoint entry to load.
   */
  entrypointLoader: EntrypointLoader;

  /**
   * enableCustomCSS will insert the custom CSS into the template if it is
   * available on the Tenant.
   */
  enableCustomCSS?: boolean;

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

  /**
   * templateVariables are variables to be passed into the template.
   */
  templateVariables?: Record<string, any>;
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

/** populate static config with request dependend data */
const populateStaticConfig = (staticConfig: StaticConfig, req: Request) => {
  const featureFlags =
    req.coral.tenant?.featureFlags?.filter(validFeatureFlagsFilter(req.user)) ||
    [];
  const flattenReplies = req.coral.tenant?.flattenReplies || false;
  return {
    ...staticConfig,
    featureFlags,
    tenantDomain: req.coral.tenant?.domain,
    flattenReplies,
  };
};

const clientHandler =
  ({
    analytics,
    staticConfig,
    entrypointLoader,
    enableCustomCSS,
    defaultLocale,
    template: viewTemplate = "client",
    templateVariables = {},
  }: ClientTargetHandlerOptions): RequestHandler =>
  async (req, res, next) => {
    // Grab the locale code from the tenant configuration, if available.
    let locale: LanguageCode = defaultLocale;
    let rootURL = "";
    if (req.coral.tenant) {
      locale = req.coral.tenant.locale;
      rootURL = `${req.protocol}://${req.coral.tenant?.domain}`;
    }

    const entrypoint = await entrypointLoader();
    if (!entrypoint) {
      next(new Error("Entrypoint not available"));
      return;
    }

    res.render(viewTemplate, {
      ...templateVariables,
      analytics,
      staticURI: staticConfig.staticURI || "/",
      entrypoint,
      enableCustomCSS,
      locale,
      config: populateStaticConfig(staticConfig, req),
      rootURL,
    });
  };

const createEmbedBootstrapHandler: (
  defaultLocale: LanguageCode,
  manifestLoader: ManifestLoader,
  staticConfig: StaticConfig
) => RequestHandler<TenantCoralRequest> =
  (defaultLocale, manifestLoader, staticConfig) => async (req, res, next) => {
    if (!req.coral.tenant) {
      next(new TenantNotFoundError(req.hostname));
      return;
    }

    // Grab the locale code from the tenant configuration, if available.
    let locale: LanguageCode = defaultLocale;
    if (req.coral.tenant) {
      locale = req.coral.tenant.locale;
    }

    const streamEntrypointLoader =
      manifestLoader.createEntrypointLoader("stream");
    const entrypoint = await streamEntrypointLoader();
    const defaultFontsCSSURL = (await manifestLoader.load())[
      "assets/css/typography.css"
    ]?.src;

    if (!entrypoint) {
      next(new Error("Entrypoint not available"));
      return;
    }

    const data: EmbedBootstrapConfig = {
      locale,
      assets: {
        js: entrypoint.js.map(({ src }) => ({ src })) || [],
        css: entrypoint.css.map(({ src }) => ({ src })) || [],
      },
      customCSSURL: req.coral.tenant.customCSSURL,
      customFontsCSSURL: req.coral.tenant.customFontsCSSURL,
      defaultFontsCSSURL,
      disableDefaultFonts: Boolean(req.coral.tenant.disableDefaultFonts),
      staticConfig: populateStaticConfig(staticConfig, req),
    };

    res.json(data);
  };

export async function mountClientRoutes(
  router: Router,
  { tenantCache, mongo, ...options }: MountClientRouteOptions
) {
  const manifestLoader = createManifestLoader(
    options.config,
    "asset-manifest.json"
  );
  const embedManifestLoader = createManifestLoader(
    options.config,
    "embed-asset-manifest.json"
  );

  // Tenant identification middleware.
  router.use(
    tenantMiddleware({
      mongo,
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
      entrypointLoader: embedManifestLoader.createEntrypointLoader("main"),
      template: "amp",
    })
  );

  router.use(
    "/embed/auth",
    createClientTargetRouter({
      mongo,
      ...options,
      cacheDuration: false,
      disableFraming: true,
      entrypointLoader: manifestLoader.createEntrypointLoader("auth"),
      templateVariables: { title: options.config.get("signin_window_title") },
    })
  );

  router.use(
    "/account",
    createClientTargetRouter({
      mongo,
      ...options,
      cacheDuration: false,
      disableFraming: true,
      entrypointLoader: manifestLoader.createEntrypointLoader("account"),
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
      entrypointLoader: manifestLoader.createEntrypointLoader("admin"),
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
      entrypointLoader: manifestLoader.createEntrypointLoader("install"),
    })
  );

  // Handle the root path.
  router.get(
    "/embed/bootstrap",
    // Need cors here because we use an XMLHttpRequest to fetch this resource from
    // the embed.
    cors(),
    createEmbedBootstrapHandler(
      options.defaultLocale,
      manifestLoader,
      options.staticConfig
    )
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
