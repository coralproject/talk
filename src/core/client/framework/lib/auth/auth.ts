import { Claims, computeExpiresIn, parseAccessTokenClaims } from "./helpers";

/**
 * ACCESS_TOKEN_KEY is the key in storage where the accessToken is stored.
 */
const ACCESS_TOKEN_KEY = "coral:v2:accessToken";

export interface AuthState {
  /**
   * accessToken is the access token issued by the server.
   */
  accessToken: string;

  /**
   * claims are the parsed claims from the access token.
   */
  claims: Claims;
}

export type AccessTokenProvider = () => string | undefined;

export function parseAccessToken(accessToken: string) {
  // Try to parse the access token claims.
  const claims = parseAccessTokenClaims(accessToken);
  if (!claims) {
    // Claims couldn't be parsed.
    return;
  }

  if (claims.exp) {
    const expiresIn = computeExpiresIn(claims.exp);
    if (!expiresIn) {
      // Looks like the access token has expired.
      return;
    }
  }

  return { accessToken, claims };
}

export function retrieveAccessToken() {
  try {
    // Get the access token from storage.
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!accessToken) {
      // Looks like the access token wasn't in storage.
      return;
    }

    // Return the parsed access token.
    return parseAccessToken(accessToken);
  } catch (err) {
    // TODO: (wyattjoh) add error reporting around this error
    // eslint-disable-next-line no-console
    console.error("could not get access token from storage", err);

    return;
  }
}

export function storeAccessToken(accessToken: string) {
  // Parse the access token that's trying to be stored now. If it can't be
  // parsed, it can't be stored.
  const parsed = parseAccessToken(accessToken);
  if (!parsed) {
    return;
  }

  try {
    // Update the access token in storage.
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  } catch (err) {
    // TODO: (wyattjoh) add error reporting around this error
    // eslint-disable-next-line no-console
    console.error("could not set access token in storage", err);
  }

  // Return the parsed access token.
  return parsed;
}

export function deleteAccessToken() {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch (err) {
    // TODO: (wyattjoh) add error reporting around this error
    // eslint-disable-next-line no-console
    console.error("could not remove access token from storage", err);
  }

  return undefined;
}
