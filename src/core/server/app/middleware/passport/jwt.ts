import { Redis } from "ioredis";
import jwt, { SignOptions } from "jsonwebtoken";
import { Db } from "mongodb";
import { Strategy } from "passport-strategy";
import uuid from "uuid";

import { Config } from "talk-common/config";
import { retrieveUser, User } from "talk-server/models/user";
import { Request } from "talk-server/types/express";

const authHeaderRegex = /(\S+)\s+(\S+)/;

export function parseAuthHeader(header: string) {
  const matches = header.match(authHeaderRegex);
  if (!matches || matches.length < 3) {
    return null;
  }

  return {
    scheme: matches[1].toLowerCase(),
    value: matches[2],
  };
}

export function extractJWTFromRequest(req: Request) {
  const header = req.get("authorization");
  if (header) {
    const parts = parseAuthHeader(header);
    if (parts && parts.scheme === "bearer") {
      return parts.value;
    }
  }

  const token: string | undefined | false = req.query && req.query.access_token;
  if (token) {
    return token;
  }

  return null;
}

function generateJTIBlacklistKey(jti: string) {
  // jtib: JTI Blacklist namespace.
  return `jtib:${jti}`;
}

export async function blacklistJWT(
  redis: Redis,
  jti: string,
  validFor: number
) {
  await redis.setex(
    generateJTIBlacklistKey(jti),
    Math.ceil(validFor),
    Date.now()
  );
}

export async function checkBlacklistJWT(redis: Redis, jti: string) {
  const expiredAtString = await redis.get(generateJTIBlacklistKey(jti));
  if (expiredAtString) {
    // TODO: (wyattjoh) return a better error.
    throw new Error("JWT exists in blacklist");
  }
}

export enum AsymmetricSigningAlgorithm {
  RS256 = "RS256",
  RS384 = "RS384",
  RS512 = "RS512",
  ES256 = "ES256",
  ES384 = "ES384",
  ES512 = "ES512",
}

export enum SymmetricSigningAlgorithm {
  HS256 = "HS256",
  HS384 = "HS384",
  HS512 = "HS512",
}

export type JWTSigningAlgorithm =
  | AsymmetricSigningAlgorithm
  | SymmetricSigningAlgorithm;

export interface JWTSigningConfig {
  secret: Buffer;
  algorithm: JWTSigningAlgorithm;
}

export function createAsymmetricSigningConfig(
  algorithm: AsymmetricSigningAlgorithm,
  secret: string
): JWTSigningConfig {
  return {
    // Secrets have their newlines encoded with newline literals.
    secret: Buffer.from(secret.replace(/\\n/g, "\n")),
    algorithm,
  };
}

export function createSymmetricSigningConfig(
  algorithm: SymmetricSigningAlgorithm,
  secret: string
): JWTSigningConfig {
  return {
    secret: new Buffer(secret),
    algorithm,
  };
}

function isSymmetricSigningAlgorithm(
  algorithm: string | SymmetricSigningAlgorithm
): algorithm is SymmetricSigningAlgorithm {
  return algorithm in SymmetricSigningAlgorithm;
}

function isAsymmetricSigningAlgorithm(
  algorithm: string | AsymmetricSigningAlgorithm
): algorithm is AsymmetricSigningAlgorithm {
  return algorithm in AsymmetricSigningAlgorithm;
}

/**
 * Parses the config and provides the signing config.
 *
 * @param config the server configuration
 */
export function createJWTSigningConfig(config: Config): JWTSigningConfig {
  const secret = config.get("signing_secret");
  const algorithm = config.get("signing_algorithm");
  if (isSymmetricSigningAlgorithm(algorithm)) {
    return createSymmetricSigningConfig(algorithm, secret);
  } else if (isAsymmetricSigningAlgorithm(algorithm)) {
    return createAsymmetricSigningConfig(algorithm, secret);
  }

  // TODO: (wyattjoh) return better error.
  throw new Error("invalid algorithm specified");
}

export type SigningTokenOptions = Pick<SignOptions, "audience" | "issuer">;

export async function signTokenString(
  { algorithm, secret }: JWTSigningConfig,
  user: User,
  options: SigningTokenOptions
) {
  return jwt.sign({}, secret, {
    ...options,
    jwtid: uuid.v4(),
    algorithm,
    expiresIn: "1 day", // TODO: (wyattjoh) evaluate allowing configuration?
    subject: user.id,
  });
}

export interface JWTToken {
  jti: string;
  sub: string;
  exp: number;
  iss?: string;
}

export interface JWTStrategyOptions {
  signingConfig: JWTSigningConfig;
  mongo: Db;
  redis: Redis;
}

export class JWTStrategy extends Strategy {
  public name = "jwt";

  private signingConfig: JWTSigningConfig;
  private mongo: Db;
  private redis: Redis;

  constructor({ signingConfig, mongo, redis }: JWTStrategyOptions) {
    super();

    this.signingConfig = signingConfig;
    this.mongo = mongo;
    this.redis = redis;
  }

  public authenticate(req: Request) {
    // Lookup the token.
    const token = extractJWTFromRequest(req);
    if (!token) {
      // There was no token on the request, so there was no user, so let's mark
      // that the strategy was successful.
      return this.success(null, null);
    }

    const { tenant } = req;
    if (!tenant) {
      // TODO: (wyattjoh) return a better error.
      return this.error(new Error("tenant not found"));
    }

    jwt.verify(
      token,
      // Use the secret specified in the configuration.
      this.signingConfig.secret,
      {
        // We need to verify that the token is for the specified tenant.
        issuer: tenant.id,
        // Use the algorithm specified in the configuration.
        algorithms: [this.signingConfig.algorithm],
      },
      async (err: Error | undefined, { jti, sub }: JWTToken) => {
        if (err) {
          return this.fail(err, 401);
        }

        try {
          // Check to see if the token has been blacklisted.
          await checkBlacklistJWT(this.redis, jti);

          // Find the user referenced by the token.
          const user = await retrieveUser(this.mongo, tenant.id, sub);

          // Return them! The user may be null, but that's ok here.
          this.success(user, null);
        } catch (err) {
          return this.error(err);
        }
      }
    );
  }
}

export function createJWTStrategy(options: JWTStrategyOptions) {
  return new JWTStrategy(options);
}
