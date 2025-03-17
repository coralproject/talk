import { AppOptions } from "coral-server/app";
import {
  BskyAuthenticator,
  getEnabledIntegration,
} from "coral-server/app/authenticators/bsky";
import { TenantCacheAdapter } from "coral-server/services/tenant/cache";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

import { atprotoHandler } from "./atproto";
import { Tenant } from "coral-server/models/tenant";

type Options = Pick<
  AppOptions,
  "tenantCache" | "mongo" | "signingConfig" | "config"
>;

export const bskyHandler = ({ tenantCache, ...options }: Options) =>
  atprotoHandler({
    tenantCache,
    authenticatorFn: (tenant) => {
      const integration = getEnabledIntegration(tenant.auth.integrations.bsky);

      return new BskyAuthenticator({
        ...options,
        mongo: options.mongo,
        integration,
        callbackPath: "/api/auth/bsky/callback",
      });
    },
  });

// The bskyHandler above must have already added the authenticator to the tenant cache
export const bskyMetadataHandler = ({
  tenantCache,
  ...options
}: Options): RequestHandler<TenantCoralRequest> => {
  return async (req, res, next) => {
    const { tenant } = req.coral;
    const authenticators = new TenantCacheAdapter<BskyAuthenticator>(
      tenantCache
    );
    const authenticator = authenticators.get(tenant.id);// <= doesn't get the authenticator, it's only added to the cache if you call .authenticate first, even if it's been added, this still can't find it
    if (authenticator) {
      // If found, then send the metadata, if not
      // then error to the middleware.
      try {
        await authenticator?.metadata(req, res, next);
      } catch (err) {
        return next(err);
      }
    }
  };
};
