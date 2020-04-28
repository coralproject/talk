import jwks, { JwksClient } from "jwks-rsa";
import { Db } from "mongodb";

import { AppOptions } from "coral-server/app";
import logger from "coral-server/logger";
import { Tenant } from "coral-server/models/tenant";
import { TenantCacheAdapter } from "coral-server/services/tenant/cache";

import { Verifier } from "../jwt";
import {
  findOrCreateOIDCUserWithToken,
  getEnabledIntegration,
  isOIDCToken,
  OIDCIDToken,
} from "../oidc";

export { OIDCIDToken } from "../oidc";

export type OIDCVerifierOptions = Pick<
  AppOptions,
  "mongo" | "redis" | "tenantCache"
>;

export class OIDCVerifier implements Verifier<OIDCIDToken> {
  private mongo: Db;
  private redis: AugmentedRedis;
  private cache: TenantCacheAdapter<JwksClient>;

  constructor({ mongo, tenantCache, redis }: OIDCVerifierOptions) {
    this.mongo = mongo;
    this.redis = redis;
    this.cache = new TenantCacheAdapter(tenantCache);
  }

  public async verify(
    tokenString: string,
    token: OIDCIDToken,
    tenant: Tenant,
    now: Date
  ) {
    // Ensure that the integration is enabled.
    const integration = getEnabledIntegration(tenant.auth.integrations.oidc);

    // Grab the JWKS client to verify the SSO ID token.
    let client = this.cache.get(tenant.id);
    if (!client) {
      logger.trace({ tenantID: tenant.id }, "jwks client not cached");
      client = jwks({
        jwksUri: integration.jwksURI,
      });

      this.cache.set(tenant.id, client);
    } else {
      logger.trace({ tenantID: tenant.id }, "jwks client cached");
    }

    return findOrCreateOIDCUserWithToken(
      this.mongo,
      this.redis,
      tenant,
      client,
      integration,
      tokenString,
      now
    );
  }

  public supports(
    token: OIDCIDToken | object,
    tenant: Tenant
  ): token is OIDCIDToken {
    return (
      tenant.auth.integrations.oidc.enabled &&
      Boolean(tenant.auth.integrations.oidc.jwksURI) &&
      isOIDCToken(token)
    );
  }
}
