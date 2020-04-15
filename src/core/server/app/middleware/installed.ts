import { isInstalled } from "coral-server/services/tenant";
import { RequestHandler } from "coral-server/types/express";

export interface InstalledMiddlewareOptions {
  redirectURL?: string;
  redirectIfInstalled?: boolean;
}

const DefaultInstalledMiddlewareOptions: Required<InstalledMiddlewareOptions> = {
  redirectIfInstalled: false,
  redirectURL: "/install",
};

export const installedMiddleware = ({
  redirectIfInstalled = DefaultInstalledMiddlewareOptions.redirectIfInstalled,
  redirectURL = DefaultInstalledMiddlewareOptions.redirectURL,
}: InstalledMiddlewareOptions = DefaultInstalledMiddlewareOptions): RequestHandler => async (
  req,
  res,
  next
) => {
  if (!req.coral) {
    return next(new Error("coral was not set"));
  }

  if (!req.coral.cache) {
    return next(new Error("cache was not set"));
  }

  const installed = await isInstalled(req.coral.cache.tenant, req.hostname);

  // If Coral is installed, and redirectIfInstall is true, then it will redirect.
  // If Coral is not installed, and redirectIfInstall is false, then it will also
  // redirect.
  if (installed === redirectIfInstalled) {
    return res.redirect(redirectURL);
  }

  next();
};
