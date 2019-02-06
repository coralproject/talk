import { Redis } from "ioredis";
import jwt from "jsonwebtoken";
import { Db } from "mongodb";
import now from "performance-now";

import logger from "talk-server/logger";
import { Tenant } from "talk-server/models/tenant";
import { retrieveUser } from "talk-server/models/user";
import { checkJWTRevoked, JWTSigningConfig } from "talk-server/services/jwt";

export interface JWTToken {
  /**
   * jti is the Token identifier. With normal login tokens, this is a randomly
   * generated uuid, which is added to a revoke list when the User "logs out".
   * For Personal Access Tokens, this is the Token identifier.
   */
  jti: string;

  /**
   * sub is the ID of the User that this Token is associated with.
   */
  sub: string;

  /**
   * iss is the ID of the Tenant that this Token is associated with.
   */
  iss: string;

  /**
   * exp is the optional expiry for the tokens. Personal Access Token's do not
   * have an expiry associated with them, hence why it's optional.
   */
  exp?: number;

  /**
   * pat, when true, indicates that this Token is a Personal Access Token, and
   * it's `jti` claim should be treated as the Token ID. These tokens cannot be
   * logged out and instead must be deactivated.
   */
  pat?: boolean;
}

export function isJWTToken(token: JWTToken | object): token is JWTToken {
  if (
    typeof (token as JWTToken).jti !== "string" ||
    typeof (token as JWTToken).sub !== "string" ||
    typeof (token as JWTToken).iss !== "string"
  ) {
    return false;
  }

  if (
    typeof (token as JWTToken).exp !== "undefined" &&
    typeof (token as JWTToken).exp !== "number"
  ) {
    return false;
  }

  if (
    typeof (token as JWTToken).pat !== "undefined" &&
    typeof (token as JWTToken).pat !== "boolean"
  ) {
    return false;
  }

  return true;
}

export interface JWTVerifierOptions {
  signingConfig: JWTSigningConfig;
  mongo: Db;
  redis: Redis;
}

export class JWTVerifier {
  private signingConfig: JWTSigningConfig;
  private mongo: Db;
  private redis: Redis;

  constructor({ signingConfig, mongo, redis }: JWTVerifierOptions) {
    this.signingConfig = signingConfig;
    this.mongo = mongo;
    this.redis = redis;
  }

  public supports(token: JWTToken | object, tenant: Tenant): token is JWTToken {
    return isJWTToken(token) && token.iss === tenant.id;
  }

  public async verify(tokenString: string, token: JWTToken, tenant: Tenant) {
    const startTime = now();

    // Verify that the token is valid. This will throw an error if it isn't.
    jwt.verify(tokenString, this.signingConfig.secret, {
      issuer: tenant.id,
      algorithms: [this.signingConfig.algorithm],
    });

    // Compute the end time.
    const responseTime = Math.round(now() - startTime);

    logger.trace({ responseTime }, "jwt verification complete");

    // Check to see if this is a Personal Access Token, these tokens cannot be
    // revoked.
    if (!token.pat) {
      // Check to see if the token has been revoked, as these tokens can be
      // revoked.
      await checkJWTRevoked(this.redis, token.jti);
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
