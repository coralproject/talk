import { AppOptions } from "coral-server/app";
import { FacebookAuthenticator } from "coral-server/app/authenticators/facebook";
import { getEnabledIntegration } from "coral-server/app/authenticators/facebook/helpers";
import { TenantCacheAdapter } from "coral-server/services/tenant/cache";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

export const facebookHandler = ({
  tenantCache,
  mongo,
  signingConfig,
}: AppOptions): RequestHandler<TenantCoralRequest> => {
  const clients = new TenantCacheAdapter<FacebookAuthenticator>(tenantCache);

  return async (req, res, next) => {
    try {
      const { tenant } = req.coral;
      const integration = getEnabledIntegration(
        tenant.auth.integrations.facebook
      );

      // Get or create the authenticator.
      let authenticator = clients.get(tenant.id);
      if (!authenticator) {
        authenticator = new FacebookAuthenticator({
          signingConfig,
          mongo,
          integration,
          callbackPath: "/api/auth/facebook/callback",
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
