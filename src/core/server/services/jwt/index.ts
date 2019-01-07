import { Redis } from "ioredis";
import jwt, { SignOptions } from "jsonwebtoken";
import { Bearer } from "permit";
import uuid from "uuid/v4";

import { Config } from "talk-server/config";
import { User } from "talk-server/models/user";
import { Request } from "talk-server/types/express";

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

export type SigningTokenOptions = Pick<
  SignOptions,
  "jwtid" | "audience" | "issuer" | "expiresIn" | "notBefore"
>;

export const signTokenString = async (
  { algorithm, secret }: JWTSigningConfig,
  user: User,
  options: SigningTokenOptions
) =>
  jwt.sign({}, secret, {
    jwtid: uuid(),
    // TODO: (wyattjoh) evaluate allowing configuration?
    expiresIn: "1 day",
    ...options,
    subject: user.id,
    algorithm,
  });

export const signPATString = async (
  { algorithm, secret }: JWTSigningConfig,
  user: User,
  options: SigningTokenOptions
) =>
  jwt.sign({ pat: true }, secret, {
    ...options,
    subject: user.id,
    algorithm,
  });

export function extractJWTFromRequest(req: Request) {
  const permit = new Bearer({
    basic: "password",
    query: "accessToken",
  });

  return permit.check(req) || null;
}

function generateJTIRevokedKey(jti: string) {
  // jtir: JTI Revoked namespace.
  return `jtir:${jti}`;
}

export async function revokeJWT(redis: Redis, jti: string, validFor: number) {
  await redis.setex(
    generateJTIRevokedKey(jti),
    Math.ceil(validFor),
    Date.now()
  );
}

export async function checkJWTRevoked(redis: Redis, jti: string) {
  const expiredAtString = await redis.get(generateJTIRevokedKey(jti));
  if (expiredAtString) {
    // TODO: (wyattjoh) return a better error.
    throw new Error("JWT was revoked");
  }
}
