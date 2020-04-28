import Joi from "@hapi/joi";
import jwt from "jsonwebtoken";
import jwks, {
  CertSigningKey,
  JwksClient,
  RsaSigningKey,
  SigningKey,
} from "jwks-rsa";
import { isNil } from "lodash";
import { Db } from "mongodb";
import { Strategy as OAuth2Strategy, VerifyCallback } from "passport-oauth2";
import { Strategy } from "passport-strategy";

import { validate } from "coral-server/app/request/body";
import { reconstructURL } from "coral-server/app/url";
import { IntegrationDisabled, TokenInvalidError } from "coral-server/errors";
import logger from "coral-server/logger";
import { OIDCAuthIntegration } from "coral-server/models/settings";
import { Tenant } from "coral-server/models/tenant";
import {
  OIDCProfile,
  retrieveUserWithProfile,
  User,
} from "coral-server/models/user";
import { AsymmetricSigningAlgorithm } from "coral-server/services/jwt";
import {
  TenantCache,
  TenantCacheAdapter,
} from "coral-server/services/tenant/cache";
import { findOrCreate } from "coral-server/services/users";
import { validateUsername } from "coral-server/services/users/helpers";
import { Request } from "coral-server/types/express";

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

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
  name?: string;
  nickname?: string;
  preferred_username?: string;
}

export const OIDCIDTokenSchema = Joi.object()
  .keys({
    sub: Joi.string().required(),
    iss: Joi.string().required(),
    aud: Joi.string().required(),
    email: Joi.string(),
    email_verified: Joi.boolean().default(false),
    picture: Joi.string(),
    name: Joi.string(),
    nickname: Joi.string(),
    preferred_username: Joi.string(),
  })
  .fork(
    [
      "picture",
      "email",
      "email_verified",
      "name",
      "nickname",
      "preferred_username",
    ],
    (s) => s.optional()
  );

export interface StrategyItem {
  strategy: OAuth2Strategy;
  jwksClient?: JwksClient;
}

export function isOIDCToken(token: OIDCIDToken | object): token is OIDCIDToken {
  const { error } = OIDCIDTokenSchema.validate(token, {
    // OIDC ID tokens may contain many other fields we haven't seen.. We Just
    // need to check to see that it contains at least the fields we need.
    allowUnknown: true,
  });
  return isNil(error);
}

function isCertSigningKey(
  key: SigningKey | RsaSigningKey
): key is CertSigningKey {
  return Boolean((key as CertSigningKey).publicKey);
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
    if (isCertSigningKey(key)) {
      return callback(null, key.publicKey);
    } else {
      return callback(null, key.rsaPublicKey);
    }
  });
};

export function getEnabledIntegration(
  integration: OIDCAuthIntegration
): Required<OIDCAuthIntegration> {
  if (!integration.enabled) {
    throw new IntegrationDisabled("oidc");
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
    throw new IntegrationDisabled("oidc");
  }

  // TODO: (wyattjoh) for some reason, type guards above to not allow coercion to this required type.
  return integration as Required<OIDCAuthIntegration>;
}

export async function findOrCreateOIDCUser(
  mongo: Db,
  redis: AugmentedRedis,
  tenant: Tenant,
  integration: OIDCAuthIntegration,
  token: OIDCIDToken,
  now = new Date()
): Promise<Readonly<User> | null> {
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
    preferred_username,
  }: OIDCIDToken = validate(OIDCIDTokenSchema, token);

  // Construct the profile that will be used to query for the user.
  const profile: OIDCProfile = {
    type: "oidc",
    id: sub,
    issuer: iss,
    audience: aud,
  };

  // Try to lookup user given their id provided in the `sub` claim.
  let user = await retrieveUserWithProfile(mongo, tenant.id, profile);
  if (!user) {
    if (!integration.allowRegistration) {
      // Registration is disabled, so we can't create the user user here.
      return null;
    }

    // FIXME: implement rules.

    // Try to extract the username from the following chain:
    let username = preferred_username || nickname || name;
    if (username) {
      try {
        validateUsername(username);
      } catch (err) {
        username = undefined;
      }
    }

    // Create the new user, as one didn't exist before!
    user = await findOrCreate(
      mongo,
      redis,
      tenant,
      {
        username,
        role: GQLUSER_ROLE.COMMENTER,
        email,
        emailVerified: email_verified,
        avatar: picture,
        profile,
      },
      {},
      now
    );
  }

  // TODO: (wyattjoh) possibly update the user profile if the remaining details mismatch?

  return user;
}

export function findOrCreateOIDCUserWithToken(
  mongo: Db,
  redis: AugmentedRedis,
  tenant: Tenant,
  client: JwksClient,
  integration: OIDCAuthIntegration,
  tokenString: string,
  now: Date
) {
  return new Promise<Readonly<User> | null>((resolve, reject) => {
    logger.trace({ tenantID: tenant.id }, "verifying oidc id_token");
    jwt.verify(
      tokenString,
      signingKeyFactory(client),
      {
        issuer: integration.issuer,
        // FIXME: (wyattjoh) support additional algorithms.
        // Currently we're limited by the key retrieval factory to only support
        // RS256. Tracking available:
        //
        // https://github.com/auth0/node-jwks-rsa/issues/40
        // https://github.com/auth0/node-jwks-rsa/issues/50
        algorithms: [AsymmetricSigningAlgorithm.RS256],
        clockTimestamp: Math.floor(now.getTime() / 1000),
      },
      async (err, token) => {
        logger.trace(
          { tenantID: tenant.id },
          "finished verifying oidc id_token"
        );
        if (err) {
          return reject(
            new TokenInvalidError(tokenString, "token validation error", err)
          );
        }

        // Validate the token.
        if (typeof token === "string" || !isOIDCToken(token)) {
          return reject(
            new TokenInvalidError(tokenString, "token is not an OIDCToken")
          );
        }

        try {
          const user = await findOrCreateOIDCUser(
            mongo,
            redis,
            tenant,
            integration,
            token,
            now
          );
          return resolve(user);
        } catch (e) {
          return reject(e);
        }
      }
    );
  });
}

/**
 * OIDC_SCOPE is the set of scopes requested for users signing up via OIDC.
 */
const OIDC_SCOPE = "openid email profile";

export interface OIDCStrategyOptions {
  mongo: Db;
  tenantCache: TenantCache;
  redis: AugmentedRedis;
}

export default class OIDCStrategy extends Strategy {
  public name = "oidc";

  private mongo: Db;
  private redis: AugmentedRedis;
  private cache: TenantCacheAdapter<StrategyItem>;

  constructor({ mongo, tenantCache, redis }: OIDCStrategyOptions) {
    super();

    this.mongo = mongo;
    this.redis = redis;
    this.cache = new TenantCacheAdapter(tenantCache);
  }

  private lookupJWKSClient(
    req: Request,
    tenantID: string,
    oidc: Required<OIDCAuthIntegration>
  ): jwks.JwksClient {
    let tenantIntegration = this.cache.get(tenantID);
    if (!tenantIntegration) {
      const strategy = this.createStrategy(req, oidc);

      // Create the entry.
      tenantIntegration = {
        strategy,
      };

      // We don't reset the entry in the cache here because if we just created
      // it, we'll be creating the jwksClient anyways, so we'll update it there.
    }

    if (!tenantIntegration.jwksClient) {
      // Create the new JWKS client.
      const jwksClient = jwks({
        jwksUri: oidc.jwksURI,
      });

      // Set the jwksClient on the entry.
      tenantIntegration.jwksClient = jwksClient;

      // Update the cached entry.
      this.cache.set(tenantID, tenantIntegration);
    }

    return tenantIntegration.jwksClient;
  }

  private userAuthenticatedCallback = async (
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

    // Grab the tenant out of the request, as we need some more details. Coral
    // is guaranteed at this point.
    const { now, tenant } = req.coral!;
    if (!tenant) {
      // TODO: return a better error.
      return done(new Error("tenant not found"));
    }

    // Get the integration from the tenant. If needed, it will be used to create
    // a new strategy.
    let integration: Required<OIDCAuthIntegration>;
    try {
      integration = getEnabledIntegration(tenant.auth.integrations.oidc);
    } catch (err) {
      // TODO: wrap error?
      return done(err);
    }

    // Grab the JWKSClient.
    const client = this.lookupJWKSClient(req, tenant.id, integration);

    // Verify that the id_token is valid or not.
    try {
      const user = await findOrCreateOIDCUserWithToken(
        this.mongo,
        this.redis,
        tenant,
        client,
        integration,
        id_token,
        now
      );
      return done(null, user || undefined);
    } catch (err) {
      return done(err);
    }
  };

  private createStrategy(
    req: Request,
    integration: Required<OIDCAuthIntegration>
  ): OAuth2Strategy {
    const { clientID, clientSecret, authorizationURL, tokenURL } = integration;

    // Construct the callbackURL from the request.
    const callbackURL = reconstructURL(req, `/api/auth/oidc/callback`);

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
    const { tenant } = req.coral!;
    if (!tenant) {
      // TODO: return a better error.
      throw new Error("tenant not found");
    }

    // Get the integration from the tenant. If needed, it will be used to create
    // a new strategy.
    const integration = getEnabledIntegration(tenant.auth.integrations.oidc);

    // Try to get the Tenant's cached integrations.
    let tenantIntegration = this.cache.get(tenant.id);
    if (!tenantIntegration) {
      // Create the strategy.
      const strategy = this.createStrategy(req, integration);

      // Reset the entry.
      tenantIntegration = {
        strategy,
      };

      // Update the cached integrations value.
      this.cache.set(tenant.id, tenantIntegration);
    }

    return tenantIntegration.strategy;
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
