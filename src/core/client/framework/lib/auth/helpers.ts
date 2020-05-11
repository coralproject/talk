const SKEW_TOLERANCE = 300;

export interface Claims {
  jti?: string;
  exp?: number;
}

export function parseAccessTokenClaims<T = {}>(
  accessToken: string
): (Claims & T) | null {
  const parts = accessToken.split(".");
  if (parts.length !== 3) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn("access token does not have the right number of parts");
    }
    return null;
  }

  try {
    const claims = JSON.parse(atob(parts[1]));

    // Validate `jti` claim.
    if (!claims.jti || typeof claims.jti !== "string") {
      delete claims.jti;
    }

    // Validate `exp` claim.
    if (!claims.exp || typeof claims.exp !== "number") {
      delete claims.exp;
    }

    return claims;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("access token can not be parsed:", err);
    }

    return null;
  }
}

/**
 * computeExpiresIn will return null if we are already expired, or the time in
 * milliseconds from now that we are expired.
 *
 * @param expiredAt the epoch timestamp that we're considered expired
 */
export function computeExpiresIn(expiredAt: number) {
  const expiresIn = expiredAt * 1000 - Date.now();
  if (expiresIn + SKEW_TOLERANCE <= 0) {
    return null;
  }

  return expiresIn;
}
