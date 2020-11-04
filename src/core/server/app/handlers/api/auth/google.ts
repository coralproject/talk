import { AppOptions } from "coral-server/app";
import { GoogleAuthenticator } from "coral-server/app/authenticators/google";
import { getEnabledIntegration } from "coral-server/app/authenticators/google/helpers";
import { TenantCacheAdapter } from "coral-server/services/tenant/cache";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

export const googleHandler = ({
  tenantCache,
  mongo,
  signingConfig,
}: AppOptions): RequestHandler<TenantCoralRequest> => {
  const clients = new TenantCacheAdapter<GoogleAuthenticator>(tenantCache);

  return async (req, res, next) => {
    try {
      const { tenant } = req.coral;
      const integration = getEnabledIntegration(
        tenant.auth.integrations.google
      );

      // Get or create the authenticator.
      let authenticator = clients.get(tenant.id);
      if (!authenticator) {
        authenticator = new GoogleAuthenticator({
          signingConfig,
          mongo,
          integration,
          callbackPath: "/api/auth/google/callback",
        });

        clients.set(tenant.id, authenticator);
      }

      // Perform the authentication.
      return authenticator.authenticate(req, res, next);
    } catch (err) {
      return next(err);
    }
  };
};
