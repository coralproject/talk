import crypto from "crypto";

import { Secret } from "./secret";

export function generateRandomString(size: number, drift = 5) {
  return crypto
    .randomBytes(size + Math.floor(Math.random() * drift))
    .toString("hex");
}

export function generateSecret(prefix: string, createdAt: Date): Secret {
  // Generate a new key. We generate a key of minimum length 32 up to 37 bytes,
  // as 16 was the minimum length recommended.
  //
  // Reference: https://security.stackexchange.com/a/96176
  const secret = prefix + "_" + generateRandomString(32, 5);
  const kid = generateRandomString(8, 3);

  return { kid, secret, createdAt };
}

/**
 * isSecretExpired is a function that given a secret and the current date will
 * return whether the secret has expired.
 *
 * @param secret the secret to test
 * @param now the current date
 */
function isSecretExpired({ inactiveAt }: Secret, now: Date) {
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
export function filterExpiredSecrets(now: Date) {
  return (secret: Secret) => isSecretExpired(secret, now);
}

/**
 * filterFreshSecrets is a filtering function that can be used to filter for any
 * secret that has not been rotated.
 */
export function filterFreshSecrets() {
  return (secret: Secret) => !secret.rotatedAt;
}

/**
 * filterActiveSecrets is a filter function that can be used to filter only
 * secrets that are active.
 *
 * @param now the current date
 */
function filterActiveSecrets(now: Date) {
  return (secret: Secret) => !isSecretExpired(secret, now);
}

/**
 * generateSignature will generate a signature used to assist clients to
 * validate that the request came from Coral.
 *
 * @param secret the secret used to sign the body with
 * @param data the data to sign
 */
function generateSignature(secret: string, data: string) {
  return crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest()
    .toString("hex");
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
  signingSecrets: Secret[],
  data: string,
  now: Date
) {
  // For each of the signatures, we only want to sign the body with secrets that
  // are still active.
  return signingSecrets
    .filter(filterActiveSecrets(now))
    .map(({ secret }) => generateSignature(secret, data))
    .map(signature => `sha256=${signature}`)
    .join(",");
}
