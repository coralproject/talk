import { AppOptions } from "coral-server/app";
import {
  AtprotoAuthenticator,
  getEnabledIntegration,
} from "coral-server/app/authenticators/atproto";
import { Limiter } from "coral-server/app/request/limiter";
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

  // Starting a sign in resolves the handle and contacts the user's server, so
  // it's limited like Coral's local sign in. The URL carries a redirectTo
  // query, so the limit is counted on a fixed resource.
  const ipLimiter = new Limiter({
    redis: options.redis,
    ttl: "10m",
    max: 10,
    prefix: "ip",
    resource: "/api/auth/atproto",
    operation: "POST",
    config: options.config,
  });

  const handle =
    (action: Action): RequestHandler<TenantCoralRequest> =>
    async (req, res, next) => {
      const { tenant } = req.coral;

      if (action === "login") {
        try {
          await ipLimiter.test(req.ip);
        } catch (err) {
          return next(err);
        }
      }

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
