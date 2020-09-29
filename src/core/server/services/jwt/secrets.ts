import { AuthenticationError } from "coral-server/errors";

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

export type SigningAlgorithm =
  | AsymmetricSigningAlgorithm
  | SymmetricSigningAlgorithm;

export interface SigningConfig {
  readonly secret: string | Buffer;
  readonly algorithm: SigningAlgorithm;
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

export function createAsymmetricSigningConfig(
  algorithm: AsymmetricSigningAlgorithm,
  secret: string
): SigningConfig {
  return {
    // Secrets have their newlines encoded with newline literals.
    secret: Buffer.from(secret.replace(/\\n/g, "\n"), "utf8"),
    algorithm,
  };
}

export function createSymmetricSigningConfig(
  algorithm: SymmetricSigningAlgorithm,
  secret: string
): SigningConfig {
  return {
    secret,
    algorithm,
  };
}

/**
 * Parses the config and provides the signing config.
 */
export function createSigningConfig(
  secret: string,
  algorithm: string = SymmetricSigningAlgorithm.HS256
): SigningConfig {
  if (isSymmetricSigningAlgorithm(algorithm)) {
    return createSymmetricSigningConfig(algorithm, secret);
  } else if (isAsymmetricSigningAlgorithm(algorithm)) {
    return createAsymmetricSigningConfig(algorithm, secret);
  }

  throw new AuthenticationError(`invalid algorithm=${algorithm} specified`);
}
