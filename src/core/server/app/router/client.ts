import express, { Router } from "express";
import { minify } from "html-minifier";
import { Db } from "mongodb";
import path from "path";

import { LanguageCode } from "coral-common/helpers/i18n/locales";
import { cacheHeadersMiddleware } from "coral-server/app/middleware/cacheHeaders";
import { cspSiteMiddleware } from "coral-server/app/middleware/csp/tenant";
import { installedMiddleware } from "coral-server/app/middleware/installed";
import { tenantMiddleware } from "coral-server/app/middleware/tenant";
import logger from "coral-server/logger";
import TenantCache from "coral-server/services/tenant/cache";
import { RequestHandler } from "coral-server/types/express";

import Entrypoints, { Entrypoint } from "../helpers/entrypoints";

export interface ClientTargetHandlerOptions {
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
   * cacheDuration is the cache duration that a given request should be cached for.
   */
  cacheDuration?: string | false;

  /**
   * staticURI is prepended to the static url's that are included on the static
   * pages.
   */
  staticURI: string;
}

function createClientTargetRouter(options: ClientTargetHandlerOptions) {
  // Create a router.
  const router = express.Router();

  // Add CSP headers to the request, which only apply when serving HTML content.
  router.use(cspSiteMiddleware(options));

  // Always send the cache headers.
  router.use(cacheHeadersMiddleware(options.cacheDuration));

  // Wildcard display all the client routes under the provided prefix.
  router.get("/*", clientHandler(options));

  return router;
}

interface MountClientRouteOptions {
  defaultLocale: LanguageCode;
  tenantCache: TenantCache;
  staticURI: string;
  mongo: Db;
}

const clientHandler = ({
  staticURI,
  entrypoint,
  enableCustomCSS,
  defaultLocale,
}: ClientTargetHandlerOptions): RequestHandler => (req, res, next) => {
  // Provide configuration to the frontend in the HTML.
  const config = {
    staticURI,
  };

  // Grab the locale code from the tenant configuration, if available.
  let locale: LanguageCode = defaultLocale;
  if (req.coral && req.coral.tenant) {
    locale = req.coral.tenant.locale;
  }

  res.render(
    "client",
    { staticURI, entrypoint, enableCustomCSS, locale, config },
    (err, html) => {
      if (err) {
        return next(err);
      }

      // Send back the HTML minified.
      res.send(
        minify(html, {
          removeComments: true,
          collapseWhitespace: true,
        })
      );
    }
  );
};

export function mountClientRoutes(
  router: Router,
  { staticURI, tenantCache, defaultLocale, mongo }: MountClientRouteOptions
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
      staticURI,
      enableCustomCSS: true,
      entrypoint: entrypoints.get("stream"),
      defaultLocale,
      mongo,
    })
  );
  router.use(
    "/embed/auth/callback",
    createClientTargetRouter({
      staticURI,
      cacheDuration: false,
      entrypoint: entrypoints.get("authCallback"),
      defaultLocale,
      mongo,
    })
  );
  router.use(
    "/embed/auth",
    createClientTargetRouter({
      staticURI,
      cacheDuration: false,
      entrypoint: entrypoints.get("auth"),
      defaultLocale,
      mongo,
    })
  );

  // Add the standalone targets.
  router.use(
    "/account",
    // If we aren't already installed, redirect the user to the install page.
    installedMiddleware(),
    createClientTargetRouter({
      staticURI,
      cacheDuration: false,
      entrypoint: entrypoints.get("account"),
      defaultLocale,
      mongo,
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
      defaultLocale,
      mongo,
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
      defaultLocale,
      mongo,
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
