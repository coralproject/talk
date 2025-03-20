import { AppOptions } from "coral-server/app";
import {
  BskyAuthenticator,
  getEnabledIntegration,
} from "coral-server/app/authenticators/bsky";
import { Tenant } from "coral-server/models/tenant";
import {
  TenantCache,
  TenantCacheAdapter,
} from "coral-server/services/tenant/cache";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

type Options = Pick<
  AppOptions,
  "tenantCache" | "mongo" | "signingConfig" | "config"
>;

async function getBskyAuthenticator(
  tenant: Tenant,
  tenantCache: TenantCache,
  { ...options }: Options
) {
  const authenticators = new TenantCacheAdapter<BskyAuthenticator>(tenantCache);
  // Try to get the authenticator for this Tenant in this cache.
  let authenticator = authenticators.get(tenant.id);
  if (!authenticator) {
    const integration = getEnabledIntegration(tenant.auth.integrations.bsky);
    // Try to create a new authenticator
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

function authHandler({
  tenantCache,
  ...options
}: Options): RequestHandler<TenantCoralRequest> {
  return async (req, res, next) => {
    const { tenant } = req.coral;
    // Get the authenticator and perform the authentication.
    try {
      const auth = await getBskyAuthenticator(
        tenant,
        tenantCache,
        options as Options
      );
      await auth.authenticate(req, res, next);
    } catch (err) {
      return next(err);
    }
  };
}

function metadataHandler({
  tenantCache,
  ...options
}: Options): RequestHandler<TenantCoralRequest> {
  return async (req, res, next) => {
    const { tenant } = req.coral;

    // Get the authenticator instance and return the client-metadata.json
    const auth = await getBskyAuthenticator(
      tenant,
      tenantCache,
      options as Options
    );
    try {
      await auth.metadata(req, res, next);
    } catch (err) {
      return next(err);
    }
  };
}

export const bskyHandler = ({ tenantCache, ...options }: Options) =>
  authHandler({ tenantCache, ...options });

export const bskyMetadataHandler = ({ tenantCache, ...options }: Options) =>
  metadataHandler({ tenantCache, ...options });
