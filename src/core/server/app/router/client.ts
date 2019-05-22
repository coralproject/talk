import express, { Router } from "express";
import { minify } from "html-minifier";
import path from "path";

import { cacheHeadersMiddleware } from "coral-server/app/middleware/cacheHeaders";
import { cspTenantMiddleware } from "coral-server/app/middleware/csp/tenant";
import { installedMiddleware } from "coral-server/app/middleware/installed";
import { tenantMiddleware } from "coral-server/app/middleware/tenant";
import logger from "coral-server/logger";
import TenantCache from "coral-server/services/tenant/cache";

import Entrypoints, { Entrypoint } from "../helpers/entrypoints";

export interface ClientTargetHandlerOptions {
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

function createClientTargetRouter({
  staticURI,
  entrypoint,
  enableCustomCSS = false,
  cacheDuration = "1h",
}: ClientTargetHandlerOptions) {
  // Create a router.
  const router = express.Router();

  // Always send the cache headers.
  router.use(cacheHeadersMiddleware(cacheDuration));

  // Wildcard display all the client routes under the provided prefix.
  router.get("/*", (req, res, next) =>
    res.render(
      "client",
      { staticURI, entrypoint, enableCustomCSS },
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
    )
  );

  return router;
}

interface MountClientRouteOptions {
  tenantCache: TenantCache;
  staticURI: string;
}

export function mountClientRoutes(
  router: Router,
  { staticURI, tenantCache }: MountClientRouteOptions
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

  // Add CSP headers to the request, which only apply when serving HTML content.
  router.use(cspTenantMiddleware);

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
    "/account",
    // If we aren't already installed, redirect the user to the install page.
    installedMiddleware(),
    createClientTargetRouter({
      staticURI,
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
}
