import { isInstalled } from "talk-server/services/tenant";
import { RequestHandler } from "talk-server/types/express";

export interface InstalledMiddlewareOptions {
  redirectURL?: string;
  redirectIfInstalled?: boolean;
}

const DefaultInstalledMiddlewareOptions: Required<
  InstalledMiddlewareOptions
> = {
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
  if (!req.talk) {
    return next(new Error("talk was not set"));
  }

  if (!req.talk.cache) {
    return next(new Error("cache was not set"));
  }

  const installed = await isInstalled(req.talk.cache.tenant);

  // If Talk is installed, and redirectIfInstall is true, then it will redirect.
  // If Talk is not installed, and redirectIfInstall is false, then it will also
  // redirect.
  if (installed === redirectIfInstalled) {
    return res.redirect(redirectURL);
  }

  next();
};
