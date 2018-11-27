import Joi from "joi";
import jwt from "jsonwebtoken";
import jwks, { JwksClient } from "jwks-rsa";
import { Db } from "mongodb";
import { Strategy as OAuth2Strategy, VerifyCallback } from "passport-oauth2";
import { Strategy } from "passport-strategy";

import { validate } from "talk-server/app/request/body";
import { reconstructURL } from "talk-server/app/url";
import {
  GQLOIDCAuthIntegration,
  GQLUSER_ROLE,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { Tenant } from "talk-server/models/tenant";
import { OIDCProfile, retrieveUserWithProfile } from "talk-server/models/user";
import TenantCache from "talk-server/services/tenant/cache";
import { TenantCacheAdapter } from "talk-server/services/tenant/cache/adapter";
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
  email: string;
  email_verified?: boolean;
  picture?: string;
  name?: string;
  nickname?: string;
}

export type StrategyItem = Record<
  string,
  {
    strategy: OAuth2Strategy;
    jwksClient?: JwksClient;
  }
>;

export function isOIDCToken(token: OIDCIDToken | object): token is OIDCIDToken {
  if (
    (token as OIDCIDToken).iss &&
    (token as OIDCIDToken).sub &&
    (token as OIDCIDToken).aud
  ) {
    return true;
  }

  return false;
}

/**
 * keyFunc will provide the secret based on the given jwkw client.
 *
 * @param client the jwks client for the specific request being made
 */
const signingKeyFactory = (client: jwks.JwksClient): jwt.KeyFunction => (
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

function getEnabledIntegration(
  tenant: Tenant,
  oidcID: string
): Required<GQLOIDCAuthIntegration> {
  if (!tenant.auth.integrations.oidc) {
    // TODO: return a better error.
    throw new Error("integration not found");
  }

  // Grab the OIDC Integration from the list of integrations.
  const integration = tenant.auth.integrations.oidc.find(
    ({ id }) => id === oidcID
  );
  if (!integration) {
    // TODO: return a better error.
    throw new Error("integration not found");
  }

  // Handle when the integration is enabled/disabled.
  if (!integration.enabled) {
    // TODO: return a better error.
    throw new Error("integration not enabled");
  }

  if (
    !integration.name ||
    !integration.clientID ||
    !integration.clientSecret ||
    !integration.authorizationURL ||
    !integration.tokenURL ||
    !integration.jwksURI ||
    !integration.issuer
  ) {
    // TODO: return a better error.
    throw new Error("integration not configured");
  }

  // TODO: (wyattjoh) for some reason, type guards above to not allow coercion to this required type.
  return integration as Required<GQLOIDCAuthIntegration>;
}

export const OIDCIDTokenSchema = Joi.object()
  .keys({
    sub: Joi.string(),
    iss: Joi.string(),
    aud: Joi.string(),
    email: Joi.string(),
    email_verified: Joi.boolean().default(false),
    picture: Joi.string().default(undefined),
    name: Joi.string().default(undefined),
    nickname: Joi.string().default(undefined),
  })
  .optionalKeys(["picture", "email_verified", "name", "nickname"]);

export async function findOrCreateOIDCUser(
  db: Db,
  tenant: Tenant,
  integration: GQLOIDCAuthIntegration,
  token: OIDCIDToken
) {
  // Unpack/validate the token content.
  const {
    sub,
    iss,
    aud,
    email,
    email_verified,
    picture,
    name,
    nickname,
  }: OIDCIDToken = validate(OIDCIDTokenSchema, token);

  // Construct the profile that will be used to query for the user.
  const profile: OIDCProfile = {
    type: "oidc",
    id: sub,
    issuer: iss,
    audience: aud,
  };

  // Try to lookup user given their id provided in the `sub` claim.
  let user = await retrieveUserWithProfile(db, tenant.id, profile);
  if (!user) {
    if (!integration.allowRegistration) {
      // Registration is disabled, so we can't create the user user here.
      return;
    }

    // FIXME: implement rules.

    const displayName = nickname || name || undefined;

    // Create the new user, as one didn't exist before!
    user = await upsert(db, tenant, {
      username: null,
      displayName,
      role: GQLUSER_ROLE.COMMENTER,
      email,
      emailVerified: email_verified,
      avatar: picture,
      profiles: [profile],
    });
  }

  // TODO: (wyattjoh) possibly update the user profile if the remaining details mismatch?

  return user;
}

/**
 * OIDC_SCOPE is the set of scopes requested for users signing up via OIDC.
 */
const OIDC_SCOPE = "openid email profile";

export interface OIDCStrategyOptions {
  mongo: Db;
  tenantCache: TenantCache;
}

export default class OIDCStrategy extends Strategy {
  public name = "oidc";

  private mongo: Db;
  private cache: TenantCacheAdapter<StrategyItem>;

  constructor({ mongo, tenantCache }: OIDCStrategyOptions) {
    super();

    this.mongo = mongo;
    this.cache = new TenantCacheAdapter(tenantCache);
  }

  private lookupJWKSClient(
    req: Request,
    tenantID: string,
    oidc: Required<GQLOIDCAuthIntegration>
  ): jwks.JwksClient {
    let tenantIntegrations = this.cache.get(tenantID);
    if (!tenantIntegrations || !tenantIntegrations[oidc.id]) {
      const strategy = this.createStrategy(req, oidc);

      // Create the entry.
      tenantIntegrations = {
        [oidc.id]: {
          strategy,
        },
        ...(tenantIntegrations || {}),
      };

      // We don't reset the entry in the cache here because if we just created
      // it, we'll be creating the jwksClient anyways, so we'll update it there.
    }

    const tenantIntegration = tenantIntegrations[oidc.id];

    if (!tenantIntegration.jwksClient) {
      // Create the new JWKS client.
      const jwksClient = jwks({
        jwksUri: oidc.jwksURI,
      });

      // Set the jwksClient on the entry.
      tenantIntegration.jwksClient = jwksClient;

      // Update the cached entry.
      this.cache.set(tenantID, {
        [oidc.id]: {
          ...tenantIntegration,
          jwksClient,
        },
        ...tenantIntegrations,
      });
    }

    return tenantIntegration.jwksClient;
  }

  private userAuthenticatedCallback = (
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
    const { tenant } = req.talk!;
    if (!tenant) {
      // TODO: return a better error.
      return done(new Error("tenant not found"));
    }

    // Grab the OIDC ID from the request.
    const { oidc: oidcID }: { oidc: string } = req.params;

    // Get the integration from the tenant. If needed, it will be used to create
    // a new strategy.
    let integration: Required<GQLOIDCAuthIntegration>;
    try {
      integration = getEnabledIntegration(tenant, oidcID);
    } catch (err) {
      // TODO: wrap error?
      return done(err);
    }

    // Grab the JWKSClient.
    const client = this.lookupJWKSClient(req, tenant.id, integration);

    // Verify that the id_token is valid or not.
    jwt.verify(
      id_token,
      signingKeyFactory(client),
      {
        issuer: integration.issuer,
      },
      async (err, decoded) => {
        if (err) {
          // TODO: wrap error?
          return done(err);
        }

        try {
          const user = await findOrCreateOIDCUser(
            this.mongo,
            tenant,
            integration,
            decoded as OIDCIDToken
          );
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    );
  };

  private createStrategy(
    req: Request,
    integration: Required<GQLOIDCAuthIntegration>
  ): OAuth2Strategy {
    const { clientID, clientSecret, authorizationURL, tokenURL } = integration;

    // Construct the callbackURL from the request.
    const callbackURL = reconstructURL(
      req,
      `/api/tenant/auth/oidc/${integration.id}/callback`
    );

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
      this.userAuthenticatedCallback
    );
  }

  private lookupStrategy(req: Request): OAuth2Strategy {
    const { tenant } = req.talk!;
    if (!tenant) {
      // TODO: return a better error.
      throw new Error("tenant not found");
    }

    // Get the OIDC ID.
    const { oidc: oidcID }: { oidc: string } = req.params;

    // Get the integration from the tenant. If needed, it will be used to create
    // a new strategy.
    const integration = getEnabledIntegration(tenant, oidcID);

    // Try to get the Tenant's cached integrations.
    let tenantIntegrations = this.cache.get(tenant.id);
    if (!tenantIntegrations || !tenantIntegrations[oidcID]) {
      // Create the strategy.
      const strategy = this.createStrategy(req, integration);

      // Reset the entry.
      tenantIntegrations = {
        [oidcID]: {
          strategy,
        },
        ...(tenantIntegrations || {}),
      };

      // Update the cached integrations value.
      this.cache.set(tenant.id, tenantIntegrations);
    }

    return tenantIntegrations[oidcID].strategy;
  }

  public authenticate(req: Request) {
    try {
      // Lookup the strategy.
      const strategy = this.lookupStrategy(req);
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
