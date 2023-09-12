import { OAuth2Authenticator } from "coral-server/app/authenticators/oauth2";
import { Tenant } from "coral-server/models/tenant";
import {
  TenantCache,
  TenantCacheAdapter,
} from "coral-server/services/tenant/cache";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

interface Options<Authenticator extends OAuth2Authenticator> {
  tenantCache: TenantCache;

  /**
   * authenticatorFn will return the authenticator for this Tenant based on the
   * provided type.
   */
  authenticatorFn: (tenant: Tenant) => Authenticator;
}

export function oauth2Handler<Authenticator extends OAuth2Authenticator>({
  tenantCache,
  authenticatorFn,
}: Options<Authenticator>): RequestHandler<TenantCoralRequest> {
  const authenticators = new TenantCacheAdapter<Authenticator>(tenantCache);

  return async (req, res, next) => {
    const { tenant } = req.coral;

    // Try to get the authenticator for this Tenant in this cache.
    let authenticator = authenticators.get(tenant.id);

    if (!authenticator) {
      // Try to create the authenticator, if we fail at creating it, we should
      // then error to the middleware.
      try {
        authenticator = authenticatorFn(tenant);
      } catch (err) {
        return next(err);
      }

      // Update the authenticator in the set of authenticators.
      authenticators.set(tenant.id, authenticator);
    }

    // Perform the authentication.
    try {
      await authenticator.authenticate(req, res, next);
    } catch (err) {
      return next(err);
    }
  };
}
