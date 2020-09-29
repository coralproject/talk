import { container } from "tsyringe";

import { isInstalled } from "coral-server/services/tenant";
import { TenantCache } from "coral-server/services/tenant/cache";
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
}: Options = defaultOptions): RequestHandler => {
  // TODO: Replace with DI.
  const tenantCache = container.resolve(TenantCache);

  return async (req, res, next) => {
    const installed = await isInstalled(tenantCache, req.hostname);

    // If Coral is installed, and redirectIfInstall is true, then it will
    // redirect. If Coral is not installed, and redirectIfInstall is false, then
    // it will also redirect.
    if (installed === redirectIfInstalled) {
      return res.redirect(redirectURL);
    }

    next();
  };
};
