import { Redis } from "ioredis";
import jwt, { SignOptions } from "jsonwebtoken";
import { Db } from "mongodb";
import { Strategy } from "passport-strategy";
import { Bearer } from "permit";
import uuid from "uuid";

import { Config } from "talk-common/config";
import { Tenant } from "talk-server/models/tenant";
import { retrieveUser, User } from "talk-server/models/user";
import { Request } from "talk-server/types/express";

export function extractJWTFromRequest(req: Request) {
  const permit = new Bearer({
    basic: "password",
    query: "access_token",
  });

  return permit.check(req) || null;
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

export const signTokenString = async (
  { algorithm, secret }: JWTSigningConfig,
  user: User,
  options: SigningTokenOptions
) =>
  jwt.sign({}, secret, {
    ...options,
    jwtid: uuid.v4(),
    algorithm,
    expiresIn: "1 day", // TODO: (wyattjoh) evaluate allowing configuration?
    subject: user.id,
  });

function getTokenAudience(token: string): string {
  const decoded = jwt.decode(token);
  if (decoded && typeof decoded !== "string") {
    return decoded.aud;
  }

  return "";
}

export interface JWTToken {
  jti: string;
  sub: string;
  exp: number;
  aud: string;
  iss: string;
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

  private checkStrategyViability(token: string, tenant: Tenant) {
    const integration = tenant.auth.integrations.local;
    if (!integration.enabled) {
      // The integration is not enabled.
      return false;
    }

    // Get the token audience and verify if this is for this strategy or not.
    const audience = getTokenAudience(token);
    if (audience !== "jwt") {
      return false;
    }

    return true;
  }

  public authenticate(req: Request) {
    // Lookup the token.
    const token = extractJWTFromRequest(req);
    if (!token) {
      // There was no token on the request, so there was no user, so let's mark
      // that the strategy was successful.
      return this.pass();
    }

    const { tenant } = req;
    if (!tenant) {
      // TODO: (wyattjoh) return a better error.
      return this.error(new Error("tenant not found"));
    }

    if (!this.checkStrategyViability(token, tenant)) {
      return this.pass();
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
      async (err: Error | undefined, decoded: JWTToken) => {
        if (err) {
          return this.fail(err, 401);
        }

        if (!decoded) {
          // There was no token on the request, so there was no user, so let's
          // mark that the strategy was successful.
          return this.success(null, null);
        }

        try {
          // Find the user.
          const user = await retrieveUser(this.mongo, tenant.id, decoded.sub);

          // Check to see if the token has been blacklisted.
          await checkBlacklistJWT(this.redis, decoded.jti);

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
