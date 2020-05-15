import crypto from "crypto";

import { SigningSecret } from "./signingSecret";

function generateSecureRandomString(size: number, drift = 5) {
  return crypto
    .randomBytes(size + Math.floor(Math.random() * drift))
    .toString("hex");
}

export function generateSigningSecret(
  prefix: string,
  createdAt: Date
): SigningSecret {
  // Generate a new key. We generate a key of minimum length 32 up to 37 bytes,
  // as 16 was the minimum length recommended.
  //
  // Reference: https://security.stackexchange.com/a/96176
  const secret = prefix + "_" + generateSecureRandomString(32, 5);
  const kid = generateSecureRandomString(8, 3);

  return { kid, secret, createdAt };
}

/**
 * isSecretExpired is a function that given a secret and the current date will
 * return whether the secret has expired.
 *
 * @param secret the secret to test
 * @param now the current date
 */
function isSigningSecretExpired({ inactiveAt }: SigningSecret, now: Date) {
  if (inactiveAt && inactiveAt <= now) {
    return true;
  }

  return false;
}

/**
 * filterExpiredSecrets is a filter function that can be used to filter only
 * secrets that are inactive or expired.
 *
 * @param now the current date
 */
export function filterExpiredSigningSecrets(now: Date) {
  return (secret: SigningSecret) => isSigningSecretExpired(secret, now);
}

/**
 * filterFreshSecrets is a filtering function that can be used to filter for any
 * secret that has not been rotated.
 */
export function filterFreshSigningSecrets() {
  return (secret: SigningSecret) => !secret.rotatedAt;
}

/**
 * filterActiveSecrets is a filter function that can be used to filter only
 * secrets that are active.
 *
 * @param now the current date
 */
export function filterActiveSigningSecrets(now: Date) {
  return (secret: SigningSecret) => !isSigningSecretExpired(secret, now);
}

/**
 * generateSignature will generate a signature used to assist clients to
 * validate that the request came from Coral.
 *
 * @param key the secret used to sign the body with
 * @param data the data to sign
 */
function generateSignature(key: string, data: string) {
  return crypto.createHmac("sha256", key).update(data).digest().toString("hex");
}

/**
 * generateSignatures will return a header value that can be used to verify the
 * integrity and authenticity of a payload sent from Coral.
 *
 * @param signingSecrets the secrets that should be used to sign the data with
 * @param data the data to sign
 * @param now the current date
 */
export function generateSignatures(
  signingSecrets: SigningSecret[],
  data: string,
  now: Date
) {
  // For each of the signatures, we only want to sign the body with secrets that
  // are still active.
  return signingSecrets
    .filter(filterActiveSigningSecrets(now))
    .map(({ secret }) => generateSignature(secret, data))
    .map((signature) => `sha256=${signature}`)
    .join(",");
}
