export interface Secret {
  /**
   * kid is the identifier for the key used when verifying tokens issued by the
   * provider.
   */
  kid: string;

  /**
   * secret is the actual underlying secret used to verify the tokens with.
   */
  secret: string;

  /**
   * createdAt is the date that the key was created at.
   */
  createdAt: Date;

  /**
   * rotatedAt is the time that the token was rotated out.
   */
  rotatedAt?: Date;

  /**
   * inactiveAt is the date that the token can no longer be used to validate
   * tokens.
   */
  inactiveAt?: Date;
}

export function isSecretExpired({ inactiveAt }: Secret, now = new Date()) {
  if (inactiveAt && inactiveAt <= now) {
    return true;
  }

  return false;
}

export function filterExpiredSecrets(now = new Date()) {
  return (secret: Secret) => isSecretExpired(secret, now);
}

export function filterActiveSecrets(now = new Date()) {
  return (secret: Secret) => !isSecretExpired(secret, now);
}
