import { isInstalled } from "coral-server/services/tenant";
import { RequestHandler } from "coral-server/types/express";

interface Options {
  redirectURL?: string;
  redirectIfInstalled?: boolean;
}

const defaultOptions: Required<Options> = {
  redirectIfInstalled: false,
  redirectURL: "/install",
};

export const installedMiddleware = ({
  redirectIfInstalled = defaultOptions.redirectIfInstalled,
  redirectURL = defaultOptions.redirectURL,
}: Options = defaultOptions): RequestHandler => async (req, res, next) => {
  const installed = await isInstalled(req.coral.cache.tenant, req.hostname);

  // If Coral is installed, and redirectIfInstall is true, then it will
  // redirect. If Coral is not installed, and redirectIfInstall is false, then
  // it will also redirect.
  if (installed === redirectIfInstalled) {
    return res.redirect(redirectURL);
  }

  next();
};
