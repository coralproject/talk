import { AppOptions } from "coral-server/app";
import {
  BskyAuthenticator,
  getEnabledIntegration,
} from "coral-server/app/authenticators/bsky";
import { Tenant } from "coral-server/models/tenant";
import { TenantCacheAdapter } from "coral-server/services/tenant/cache";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

type Options = Pick<
  AppOptions,
  "tenantCache" | "mongo" | "redis" | "signingConfig" | "config"
>;

export interface InputBody {
  handle: string;
}

async function getBskyAuthenticator(
  tenant: Tenant,
  authenticators: TenantCacheAdapter<BskyAuthenticator>,
  { ...options }: Options
) {
  // Try to get the authenticator for this Tenant in this cache.
  let authenticator = authenticators.get(tenant.id);
  if (!authenticator) {
    const integration = getEnabledIntegration(tenant.auth.integrations.bsky);
    // // Try to create a new authenticator
    authenticator = new BskyAuthenticator({
      ...options,
      integration,
      callbackPath: "/api/auth/bsky/callback",
    });

    // Update the authenticator in the set of authenticators.
    authenticators.set(tenant.id, authenticator);
  }
  return authenticator;
}

export const bskyCallbackHandler = (
  authenticators: TenantCacheAdapter<BskyAuthenticator>,
  { tenantCache, ...options }: Options
): RequestHandler<TenantCoralRequest> => {
  return async (req, res, next) => {
    const { tenant } = req.coral;
    try {
      const auth = await getBskyAuthenticator(
        tenant,
        authenticators,
        options as Options
      );
      if (auth) {
        return await auth.callback(req, res, next);
      }
    } catch (err) {
      return next(err);
    }
  };
};

export const bskyHandler = (
  authenticators: TenantCacheAdapter<BskyAuthenticator>,
  { tenantCache, ...options }: Options
): RequestHandler<TenantCoralRequest> => {
  return async (req, res, next) => {
    const { tenant } = req.coral;
    // Get the authenticator and perform the authentication.
    try {
      const auth = await getBskyAuthenticator(
        tenant,
        authenticators,
        options as Options
      );
      return await auth?.authenticate(req, res, next);
    } catch (err) {
      return next(err);
    }
  };
};

export const bskyMetadataHandler = (
  authenticators: TenantCacheAdapter<BskyAuthenticator>,
  { tenantCache, ...options }: Options
): RequestHandler<TenantCoralRequest> => {
  return async (req, res, next) => {
    const { tenant } = req.coral;
    // Get the authenticator instance and return the client-metadata.json
    try {
      const auth = await getBskyAuthenticator(
        tenant,
        authenticators,
        options as Options
      );
      if (auth) {
        return await auth?.metadata(req, res, next);
      }
    } catch (err) {
      return err;
    }
  };
};
