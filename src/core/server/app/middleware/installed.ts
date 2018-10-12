import { RequestHandler } from "express";

import { isInstalled } from "talk-server/services/tenant";
import TenantCache from "talk-server/services/tenant/cache";

export interface InstalledMiddlewareOptions {
  tenantCache: TenantCache;
  redirectURL?: string;
  redirectIfInstalled?: boolean;
}

export const installedMiddleware = ({
  tenantCache,
  redirectIfInstalled = false,
  redirectURL = "/install",
}: InstalledMiddlewareOptions): RequestHandler => async (req, res, next) => {
  const installed = await isInstalled(tenantCache);

  // If Talk is installed, and redirectIfInstall is true, then it will redirect.
  // If Talk is not installed, and redirectIfInstall is false, then it will also
  // redirect.
  if (installed === redirectIfInstalled) {
    return res.redirect(redirectURL);
  }

  next();
};
