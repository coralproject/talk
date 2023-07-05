import Joi from "joi";
import jwt from "jsonwebtoken";
import {
  CertSigningKey,
  JwksClient,
  RsaSigningKey,
  SigningKey,
} from "jwks-rsa";

import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { TokenInvalidError } from "coral-server/errors";
import { validateSchema } from "coral-server/helpers";
import { OIDCAuthIntegration } from "coral-server/models/settings";
import { Tenant } from "coral-server/models/tenant";
import {
  OIDCProfile,
  retrieveUserWithProfile,
  User,
} from "coral-server/models/user";
import { AsymmetricSigningAlgorithm } from "coral-server/services/jwt";
import { findOrCreate, validateUsername } from "coral-server/services/users";

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

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
  nonce: string;
}

export const OIDCIDTokenSchema = Joi.object()
  .keys({
    sub: Joi.string().required(),
    iss: Joi.string().required(),
    aud: Joi.string().required(),
    exp: Joi.number().required(),
    email: Joi.string().lowercase().email(),
    email_verified: Joi.boolean().default(false),
    picture: Joi.string(),
    name: Joi.string(),
    nickname: Joi.string(),
    preferred_username: Joi.string(),
    nonce: Joi.string(),
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

export function validateToken(token: OIDCIDToken | object): string | undefined {
  const { error } = OIDCIDTokenSchema.validate(token, {
    // OIDC ID tokens may contain many other fields we haven't seen.. We Just
    // need to check to see that it contains at least the fields we need.
    allowUnknown: true,
  });
  return error ? "OIDC: " + error.message : undefined;
}

function isCertSigningKey(
  key: SigningKey | RsaSigningKey
): key is CertSigningKey {
  return Boolean((key as CertSigningKey).publicKey);
}

function createKeyFunction(client: JwksClient): jwt.KeyFunction {
  return ({ kid }, callback) => {
    if (!kid) {
      return callback(new Error("no kid in id_token"));
    }

    // Get the signing key from the jwks provider.
    client.getSigningKey(kid, (err, key) => {
      if (err) {
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
}

export function verifyIDToken(
  tokenString: string,
  client: JwksClient,
  issuer: string,
  now: Date
) {
  return new Promise<Readonly<OIDCIDToken>>((resolve, reject) => {
    jwt.verify(
      tokenString,
      createKeyFunction(client),
      {
        issuer,
        // FIXME: (wyattjoh) support additional algorithms.
        // Currently we're limited by the key retrieval factory to only support
        // RS256. Tracking available:
        //
        // https://github.com/auth0/node-jwks-rsa/issues/40
        // https://github.com/auth0/node-jwks-rsa/issues/50
        algorithms: [AsymmetricSigningAlgorithm.RS256],
        clockTimestamp: Math.floor(now.getTime() / 1000),
      },
      (err, token) => {
        if (err) {
          return reject(
            new TokenInvalidError(
              tokenString,
              "token validation error",
              undefined,
              err
            )
          );
        }

        // Validate the token.
        if (typeof token === "string") {
          return reject(
            new TokenInvalidError(tokenString, "token is not an OIDCToken")
          );
        }

        const parsed = validateSchema<OIDCIDToken>(OIDCIDTokenSchema, token);

        return resolve(parsed);
      }
    );
  });
}

export async function findOrCreateOIDCUser(
  config: Config,
  mongo: MongoContext,
  tenant: Tenant,
  integration: OIDCAuthIntegration,
  {
    name,
    sub,
    iss,
    aud,
    preferred_username,
    nickname,
    email,
    email_verified,
    picture,
  }: OIDCIDToken,
  now = new Date()
): Promise<Readonly<User>> {
  // Construct the profile that will be used to query for the user.
  const profile: OIDCProfile = {
    type: "oidc",
    id: sub,
    issuer: iss,
    audience: aud,
  };

  // Try to lookup user given their id provided in the `sub` claim.
  const user = await retrieveUserWithProfile(mongo, tenant.id, profile);
  if (user) {
    return user;
  }

  if (!integration.allowRegistration) {
    throw new Error("registration is disabled");
  }

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
  return await findOrCreate(
    config,
    mongo,
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

export async function findOrCreateOIDCUserWithToken(
  config: Config,
  mongo: MongoContext,
  tenant: Tenant,
  client: JwksClient,
  integration: Required<OIDCAuthIntegration>,
  tokenString: string,
  now: Date
) {
  // Verify and parse the ID token provided.
  const token = await verifyIDToken(
    tokenString,
    client,
    integration.issuer,
    now
  );

  // Find or create the user based on the verified token.
  return findOrCreateOIDCUser(config, mongo, tenant, integration, token, now);
}
