import { AppOptions } from "coral-server/app";
import { OIDCAuthenticator } from "coral-server/app/authenticators/oidc";
import { getEnabledIntegration } from "coral-server/services/oidc";
import { TenantCacheAdapter } from "coral-server/services/tenant/cache";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

export const oidcHandler = ({
  tenantCache,
  mongo,
  signingConfig,
}: AppOptions): RequestHandler<TenantCoralRequest> => {
  const clients = new TenantCacheAdapter<OIDCAuthenticator>(tenantCache);

  return async (req, res, next) => {
    try {
      const { tenant } = req.coral;
      const integration = getEnabledIntegration(tenant.auth.integrations.oidc);

      // Get or create the authenticator.
      let authenticator = clients.get(tenant.id);
      if (!authenticator) {
        authenticator = new OIDCAuthenticator({
          signingConfig,
          mongo,
          integration,
          callbackPath: "/api/auth/oidc/callback",
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
