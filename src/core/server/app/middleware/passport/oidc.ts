import jwt from "jsonwebtoken";
import jwks, { JwksClient } from "jwks-rsa";
import { Db } from "mongodb";
import { Strategy as OAuth2Strategy, VerifyCallback } from "passport-oauth2";
import { Strategy } from "passport-strategy";

import { reconstructURL } from "talk-server/app/url";
import { GQLUSER_ROLE } from "talk-server/graph/tenant/schema/__generated__/types";
import { OIDCAuthIntegration, Tenant } from "talk-server/models/tenant";
import { OIDCProfile, retrieveUserWithProfile } from "talk-server/models/user";
import { upsert } from "talk-server/services/users";
import { Request } from "talk-server/types/express";

export interface Params {
  id_token?: string;
}

/**
 * OIDCIDToken describes the set of claims that are present in a ID Token. This
 * interface confirms with the ID Token specification as defined:
 * https://openid.net/specs/openid-connect-core-1_0.html#IDToken
 */
export interface OIDCIDToken {
  aud: string;
  iss: string;
  sub: string;
  exp: number; // TODO: use this as the source for how long an OIDC user can be logged in for
  email?: string;
  email_verified?: boolean;
  picture?: string;
}

export interface StrategyItem {
  strategy: OAuth2Strategy;
  jwksClient?: JwksClient;
}

export interface OIDCStrategyOptions {
  db: Db;
}

export function isOIDCToken(token: OIDCIDToken | object): token is OIDCIDToken {
  if (
    (token as OIDCIDToken).iss &&
    (token as OIDCIDToken).sub &&
    (token as OIDCIDToken).email
  ) {
    return true;
  }

  return false;
}

export async function findOrCreateOIDCUser(
  db: Db,
  tenant: Tenant,
  token: OIDCIDToken
) {
  // Construct the profile that will be used to query for the user.
  const profile: OIDCProfile = {
    type: "oidc",
    id: token.sub,
    issuer: token.iss,
    audience: token.aud,
  };

  // Try to lookup user given their id provided in the `sub` claim.
  let user = await retrieveUserWithProfile(db, tenant.id, profile);
  if (!user) {
    // FIXME: implement rules.

    // Create the new user, as one didn't exist before!
    user = await upsert(db, tenant, {
      username: null,
      role: GQLUSER_ROLE.COMMENTER,
      email: token.email,
      email_verified: token.email_verified,
      avatar: token.picture,
      profiles: [profile],
    });
  }

  return user;
}

/**
 * OIDC_SCOPE is the set of scopes requested for users signing up via OIDC.
 */
const OIDC_SCOPE = "openid email profile";

// FIXME: attach strategy to cache updates of the tenants

export default class OIDCStrategy extends Strategy {
  public name: string;

  private db: Db;
  private cache: Map<string, StrategyItem>;

  constructor({ db }: OIDCStrategyOptions) {
    super();

    this.name = "oidc";
    this.cache = new Map();
    this.db = db;
  }

  private async verify(
    tenant: Tenant,
    token: OIDCIDToken,
    done: VerifyCallback
  ) {
    try {
      const user = await findOrCreateOIDCUser(this.db, tenant, token);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }

  private lookupJWKSClient(
    req: Request,
    tenantID: string,
    oidc: OIDCAuthIntegration
  ) {
    let entry = this.cache.get(tenantID);
    if (!entry) {
      const strategy = this.createStrategy(req, oidc);

      // Create the entry.
      entry = {
        strategy,
      };

      // We don't reset the entry in the cache here because if we just created
      // it, we'll be creating the jwksClient anyways, so we'll update it there.
    }

    if (!entry.jwksClient) {
      // Create the new JWKS client.
      const jwksClient = jwks({
        jwksUri: oidc.jwksURI,
      });

      // Set the jwksClient on the entry.
      entry.jwksClient = jwksClient;

      // Update the cached entry.
      this.cache.set(tenantID, entry);
    }

    return entry.jwksClient;
  }

  private verifyCallback = (
    req: Request,
    accessToken: string, // ignore the access token, we don't use it.
    refreshToken: string, // ignore the refresh token, we don't use it.
    params: Params,
    profile: any, // we don't look inside the profile (yet).
    done: VerifyCallback
  ) => {
    // Try to lookup user given their id provided in the `sub` claim of the
    // `id_token`.
    const { id_token } = params;
    if (!id_token) {
      // TODO: return better error.
      return done(new Error("no id_token in params"));
    }

    // Grab the tenant out of the request, as we need some more details.
    const { tenant } = req;
    if (!tenant) {
      // TODO: return a better error.
      return done(new Error("tenant not found"));
    }

    // Get the integration from the tenant. If needed, it will be used to create
    // a new strategy.
    let integration: OIDCAuthIntegration;
    try {
      integration = getEnabledIntegration(tenant);
    } catch (err) {
      // TODO: wrap error?
      return done(err);
    }

    // Grab the JWKSClient.
    const client = this.lookupJWKSClient(req, tenant.id, integration);

    // Verify that the id_token is valid or not.
    jwt.verify(
      id_token,
      this.keyFunc(client),
      {
        issuer: integration.issuer,
      },
      (err, decoded) => {
        if (err) {
          // TODO: wrap error?
          return done(err);
        }

        // Delegate the verify method off to the passed in verify method.
        this.verify(tenant, decoded as OIDCIDToken, done);
      }
    );
  };

  /**
   * keyFunc will provide the secret based on the given jwkw client.
   *
   * @param client the jwks client for the specific request being made
   */
  private keyFunc = (client: jwks.JwksClient): jwt.KeyFunction => (
    { kid },
    callback
  ) => {
    if (!kid) {
      // TODO: return better error.
      return callback(new Error("no kid in id_token"));
    }

    // Get the signing key from the jwks provider.
    client.getSigningKey(kid, (err, key) => {
      if (err) {
        // TODO: wrap error?
        return callback(err);
      }

      // Grab the signingKey out of the provided key.
      const signingKey = key.publicKey || key.rsaPublicKey;

      callback(null, signingKey);
    });
  };

  private createStrategy(
    req: Request,
    integration: OIDCAuthIntegration
  ): OAuth2Strategy {
    const { clientID, clientSecret, authorizationURL, tokenURL } = integration;

    // Construct the callbackURL from the request.
    const callbackURL = reconstructURL(req, "/api/tenant/auth/oidc/callback");

    // Create a new OAuth2Strategy, where we pass the verify callback bound to
    // this OIDCStrategy instance.
    return new OAuth2Strategy(
      {
        passReqToCallback: true,
        clientID,
        clientSecret,
        authorizationURL,
        tokenURL,
        callbackURL,
      },
      this.verifyCallback
    );
  }

  private async lookupStrategy(req: Request) {
    const { tenant } = req;
    if (!tenant) {
      // TODO: return a better error.
      throw new Error("tenant not found");
    }

    // Get the integration from the tenant. If needed, it will be used to create
    // a new strategy.
    const integration = getEnabledIntegration(tenant);

    // Try to get the Tenant's cached integrations.
    let entry = this.cache.get(tenant.id);
    if (!entry) {
      // Create the strategy.
      const strategy = this.createStrategy(req, integration);

      // Reset the entry.
      entry = {
        strategy,
      };

      // Update the cached integrations value.
      this.cache.set(tenant.id, entry);
    }

    return entry.strategy;
  }

  public async authenticate(req: Request) {
    try {
      // Lookup the strategy.
      const strategy = await this.lookupStrategy(req);
      if (!strategy) {
        throw new Error("strategy not found");
      }

      // Augment the strategy with the request method bindings.
      strategy.error = this.error.bind(this);
      strategy.fail = this.fail.bind(this);
      strategy.pass = this.pass.bind(this);
      strategy.redirect = this.redirect.bind(this);
      strategy.success = this.success.bind(this);

      // Authenticate with the strategy, binding the current context to the method
      // to provide it with the augmented passport handlers. We also request the
      // 'openid' scope so we can get an id_token back.
      strategy.authenticate(req, {
        scope: OIDC_SCOPE,
        session: false,
      });
    } catch (err) {
      return this.error(err);
    }
  }
}

function getEnabledIntegration(tenant: Tenant) {
  const integration = tenant.auth.integrations.oidc;
  if (!integration) {
    // TODO: return a better error.
    throw new Error("integration not found");
  }

  // Handle when the integration is enabled/disabled.
  if (!integration.enabled) {
    // TODO: return a better error.
    throw new Error("integration not enabled");
  }

  return integration;
}

export function createOIDCStrategy({ db }: OIDCStrategyOptions) {
  return new OIDCStrategy({ db });
}
