import jwks, { JwksClient } from "jwks-rsa";
import { Db } from "mongodb";

import { AppOptions } from "coral-server/app";
import { getEnabledIntegration } from "coral-server/app/authenticators/oidc/helpers";
import logger from "coral-server/logger";
import { Tenant } from "coral-server/models/tenant";
import {
  findOrCreateOIDCUserWithToken,
  isOIDCToken,
  OIDCIDToken,
} from "coral-server/services/oidc";
import { TenantCacheAdapter } from "coral-server/services/tenant/cache";

import { Verifier } from "../jwt";

export type OIDCVerifierOptions = Pick<AppOptions, "mongo" | "tenantCache">;

export class OIDCVerifier implements Verifier<OIDCIDToken> {
  private mongo: Db;
  private cache: TenantCacheAdapter<JwksClient>;

  constructor({ mongo, tenantCache }: OIDCVerifierOptions) {
    this.mongo = mongo.main;
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
