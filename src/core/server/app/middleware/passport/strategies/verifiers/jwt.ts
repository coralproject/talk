import { Redis } from "ioredis";
import Joi from "joi";

import { MongoContext } from "coral-server/data/context";
import { Tenant } from "coral-server/models/tenant";
import { retrieveUser } from "coral-server/models/user";
import {
  isJWTRevoked,
  JWTSigningConfig,
  StandardClaims,
  verifyJWT,
} from "coral-server/services/jwt";

import { Verifier } from "../jwt";

export interface JWTToken
  extends Required<Pick<StandardClaims, "jti" | "sub" | "iss" | "iat">>,
    Pick<StandardClaims, "exp"> {
  /**
   * pat, when true, indicates that this Token is a Personal Access Token, and
   * it's `jti` claim should be treated as the Token ID. These tokens cannot be
   * logged out and instead must be deactivated.
   */
  pat?: boolean;
}

export const JWTTokenSchema = Joi.object().keys({
  jti: Joi.string().required(),
  sub: Joi.string().required(),
  iat: Joi.number().required(),
  iss: Joi.string().required(),
  nbf: Joi.number(),
  exp: Joi.number(),
  pat: Joi.boolean(),
});

// eslint-disable-next-line @typescript-eslint/ban-types
export function validateToken(token: JWTToken | object): string | undefined {
  const { error } = JWTTokenSchema.validate(token, {
    allowUnknown: true,
  });
  return error ? "JWT: " + error.message : undefined;
}

export interface JWTVerifierOptions {
  signingConfig: JWTSigningConfig;
  mongo: MongoContext;
  redis: Redis;
}

export class JWTVerifier implements Verifier<JWTToken> {
  private signingConfig: JWTSigningConfig;
  private mongo: MongoContext;
  private redis: Redis;

  constructor({ signingConfig, mongo, redis }: JWTVerifierOptions) {
    this.signingConfig = signingConfig;
    this.mongo = mongo;
    this.redis = redis;
  }

  public enabled(tenant: Tenant, token: JWTToken): boolean {
    return token.iss === tenant.id;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public checkForValidationError(token: JWTToken | object): string | undefined {
    return validateToken(token);
  }

  public async verify(
    tokenString: string,
    token: JWTToken,
    tenant: Tenant,
    now: Date
  ) {
    // Verify that the token is valid. This will throw an error if it isn't.
    verifyJWT(tokenString, this.signingConfig, now, { issuer: tenant.id });

    // Check to see if this is a Personal Access Token, these tokens cannot be
    // revoked.
    if (!token.pat) {
      // Check to see if the token has been revoked, as these tokens can be
      // revoked.
      if (await isJWTRevoked(this.redis, token.jti)) {
        return null;
      }
    }

    // Find the user.
    const user = await retrieveUser(this.mongo, tenant.id, token.sub);
    if (token.pat) {
      // As this is a Personal Access Token, ensure that the Token is valid by
      // checking it against the User's tokens.
      if (!user) {
        throw new Error(
          "personal access token referenced user that wasn't found"
        );
      }

      // Ensure that the token exists on the User.
      const foundToken = user.tokens.find(({ id }) => id === token.jti);
      if (!foundToken) {
        throw new Error("personal access token does not exist");
      }
    }

    // Return the user now that we have found them!.
    return user;
  }
}
