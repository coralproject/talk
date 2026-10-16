import { AppOptions } from "coral-server/app";
import {
  AtprotoAuthenticator,
  getEnabledIntegration,
} from "coral-server/app/authenticators/atproto";
import { Limiter } from "coral-server/app/request/limiter";
import logger from "coral-server/logger";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import { TenantCacheAdapter } from "coral-server/services/tenant/cache";
import {
  Request,
  RequestHandler,
  TenantCoralRequest,
} from "coral-server/types/express";

type Options = Pick<
  AppOptions,
  "tenantCache" | "mongo" | "signingConfig" | "config" | "redis"
>;

type Action = "login" | "metadata" | "callback";

/**
 * atprotoHandlers returns the handlers for the atproto routes, and revoke for
 * signing out. They share one authenticator per Tenant, which is rebuilt when
 * the Tenant changes, so each Tenant has its own client, stores and lock.
 */
export const atprotoHandlers = ({ tenantCache, ...options }: Options) => {
  const authenticators = new TenantCacheAdapter<AtprotoAuthenticator>(
    tenantCache
  );

  /**
   * getAuthenticator returns the Tenant's authenticator, creating it if
   * needed. It throws when atproto isn't enabled for the Tenant.
   */
  const getAuthenticator = (tenant: Tenant) => {
    let authenticator = authenticators.get(tenant.id);
    if (!authenticator) {
      authenticator = new AtprotoAuthenticator({
        ...options,
        tenant,
        integration: getEnabledIntegration(tenant.auth.integrations.atproto),
      });
      authenticators.set(tenant.id, authenticator);
    }

    return authenticator;
  };

  /**
   * revoke ends the user's session with their atproto authorization server,
   * when they signed in with atproto. It's called when they sign out of Coral,
   * so a later sign in starts a new authorization. It never throws, signing
   * out of Coral doesn't depend on it.
   */
  const revoke = async (req: Request, tenant: Tenant, user: User) => {
    const profile = user.profiles?.find((p) => p.type === "atproto");
    if (!profile) {
      return;
    }

    try {
      await getAuthenticator(tenant).revokeSession(req, profile.id);
    } catch (err) {
      logger.warn(
        { err, tenantID: tenant.id, userID: user.id },
        "could not revoke atproto session"
      );
    }
  };

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

      let authenticator: AtprotoAuthenticator;
      try {
        authenticator = getAuthenticator(tenant);
      } catch (err) {
        return next(err);
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
    revoke,
  };
};
