import { AppOptions } from "coral-server/app";
import {
  AtprotoAuthenticator,
  getEnabledIntegration,
} from "coral-server/app/authenticators/atproto";
import { TenantCacheAdapter } from "coral-server/services/tenant/cache";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

type Options = Pick<
  AppOptions,
  "tenantCache" | "mongo" | "signingConfig" | "config" | "redis"
>;

type Action = "login" | "metadata" | "callback";

/**
 * atprotoHandlers returns the handlers for the atproto routes. They share one
 * authenticator per Tenant, which is rebuilt when the Tenant changes.
 */
export const atprotoHandlers = ({ tenantCache, ...options }: Options) => {
  const authenticators = new TenantCacheAdapter<AtprotoAuthenticator>(
    tenantCache
  );

  const handle =
    (action: Action): RequestHandler<TenantCoralRequest> =>
    async (req, res, next) => {
      const { tenant } = req.coral;

      let authenticator = authenticators.get(tenant.id);
      if (!authenticator) {
        try {
          authenticator = new AtprotoAuthenticator({
            ...options,
            tenant,
            integration: getEnabledIntegration(
              tenant.auth.integrations.atproto
            ),
          });
        } catch (err) {
          return next(err);
        }

        authenticators.set(tenant.id, authenticator);
      }

      try {
        await authenticator[action](req, res, next);
      } catch (err) {
        return next(err);
      }
    };

  return {
    login: handle("login"),
    metadata: handle("metadata"),
    callback: handle("callback"),
  };
};
