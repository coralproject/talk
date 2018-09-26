import { Redis } from "ioredis";
import jwt from "jsonwebtoken";
import { Db } from "mongodb";

import { Tenant } from "talk-server/models/tenant";
import { retrieveUser } from "talk-server/models/user";
import { checkBlacklistJWT, JWTSigningConfig } from "talk-server/services/jwt";

export interface JWTToken {
  jti: string;
  sub: string;
  exp: number;
  aud: string;
  iss: string;
}

export function isJWTToken(token: JWTToken | object): token is JWTToken {
  return (
    typeof (token as JWTToken).jti === "string" &&
    typeof (token as JWTToken).sub === "string" &&
    typeof (token as JWTToken).exp === "number" &&
    typeof (token as JWTToken).aud === "string" &&
    typeof (token as JWTToken).iss === "string"
  );
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
    return isJWTToken(token);
  }

  public async verify(tokenString: string, token: JWTToken, tenant: Tenant) {
    // Verify that the token is valid. This will throw an error if it isn't.
    jwt.verify(tokenString, this.signingConfig.secret, {
      issuer: tenant.id,
      algorithms: [this.signingConfig.algorithm],
    });

    // Check to see if the token has been blacklisted, as these tokens can be
    // revoked.
    await checkBlacklistJWT(this.redis, token.jti);

    // Find the user.
    const user = await retrieveUser(this.mongo, tenant.id, token.sub);

    // Return the user now that we have found them!.
    return user;
  }
}
