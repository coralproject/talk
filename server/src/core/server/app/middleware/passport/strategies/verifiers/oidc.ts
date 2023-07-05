import jwks, { JwksClient } from "jwks-rsa";

import { AppOptions } from "coral-server/app";
import { getEnabledIntegration } from "coral-server/app/authenticators/oidc/helpers";
import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import logger from "coral-server/logger";
import { Tenant } from "coral-server/models/tenant";
import {
  findOrCreateOIDCUserWithToken,
  OIDCIDToken,
  validateToken,
} from "coral-server/services/oidc";
import { TenantCacheAdapter } from "coral-server/services/tenant/cache";

import { Verifier } from "../jwt";

export type OIDCVerifierOptions = Pick<
  AppOptions,
  "mongo" | "tenantCache" | "config"
>;

export class OIDCVerifier implements Verifier<OIDCIDToken> {
  private config: Config;
  private mongo: MongoContext;
  private cache: TenantCacheAdapter<JwksClient>;

  constructor({ mongo, tenantCache, config }: OIDCVerifierOptions) {
    this.mongo = mongo;
    this.cache = new TenantCacheAdapter(tenantCache);
    this.config = config;
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
      this.config,
      this.mongo,
      tenant,
      client,
      integration,
      tokenString,
      now
    );
  }

  public enabled(tenant: Tenant): boolean {
    return (
      tenant.auth.integrations.oidc.enabled &&
      Boolean(tenant.auth.integrations.oidc.jwksURI)
    );
  }

  public checkForValidationError(
    token: OIDCIDToken | object
  ): string | undefined {
    return validateToken(token);
  }
}
