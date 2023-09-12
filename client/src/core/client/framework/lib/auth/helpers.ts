import decode from "jwt-decode";

const SKEW_TOLERANCE = 300;

export interface Claims {
  jti?: string;
  exp?: number;
}

export function parseAccessTokenClaims<T = {}>(
  accessToken: string
): (Claims & T) | null {
  try {
    const claims = decode<Claims & T>(accessToken);

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
    // TODO: (wyattjoh) add error reporting around this error
    // eslint-disable-next-line no-console
    console.error("access token can not be parsed:", err);

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
