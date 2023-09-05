import { commitLocalUpdate, Environment } from "react-relay";
import { RecordProxy } from "relay-runtime";

import { ManagedSubscriptionClient } from "../network";
import { LOCAL_ID } from "../relay";
import { PromisifiedStorage } from "../storage";
import { Claims, computeExpiresIn, parseAccessTokenClaims } from "./helpers";

/**
 * ACCESS_TOKEN_KEY is the key in storage where the accessToken is stored.
 */
const ACCESS_TOKEN_KEY = "v2:accessToken";

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

export function parseAccessToken(accessToken: string): AuthState | null {
  // Try to parse the access token claims.
  const claims = parseAccessTokenClaims(accessToken);
  if (!claims) {
    // Claims couldn't be parsed.
    return null;
  }

  if (claims.exp) {
    const expiresIn = computeExpiresIn(claims.exp);
    if (!expiresIn) {
      // Looks like the access token has expired.
      return null;
    }
  }

  return { accessToken, claims };
}

export async function retrieveAccessToken(localStorage: PromisifiedStorage) {
  try {
    // Get the access token from storage.
    const accessToken = await localStorage.getItem(ACCESS_TOKEN_KEY);
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

export async function storeAccessTokenInLocalStorage(
  localStorage: PromisifiedStorage,
  accessToken: string
): Promise<AuthState | null> {
  // Parse the access token that's trying to be stored now. If it can't be
  // parsed, it can't be stored.
  const parsed = parseAccessToken(accessToken);
  if (!parsed) {
    return null;
  }

  try {
    // Update the access token in storage.
    await localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  } catch (err) {
    // TODO: (wyattjoh) add error reporting around this error
    // eslint-disable-next-line no-console
    console.error("could not set access token in storage", err);
  }

  // Return the parsed access token.
  return parsed;
}

/**
 * Commits auth state to relay store.
 */
export function commitAuthState(
  environment: Environment,
  auth: AuthState | null
) {
  commitLocalUpdate(environment, (store) => {
    const local = store.get(LOCAL_ID)!;
    setAuthStateInLocalRecord(local, auth);
  });
}

export function setAuthStateInLocalRecord(
  local: RecordProxy,
  auth: AuthState | null
) {
  // Update the access token properties.
  local.setValue(auth?.accessToken || null, "accessToken");
  // Update the claims.
  local.setValue(auth?.claims.exp || null, "accessTokenExp");
  local.setValue(auth?.claims.jti || null, "accessTokenJTI");
}

export async function replaceAccessTokenOnTheFly(
  environment: Environment,
  subscriptionClient: ManagedSubscriptionClient,
  localStorage: PromisifiedStorage,
  accessToken: string,
  options: { ephemeral?: boolean } = {}
) {
  const auth = options.ephemeral
    ? parseAccessToken(accessToken)
    : await storeAccessTokenInLocalStorage(localStorage, accessToken);
  if (!auth) {
    return;
  }
  subscriptionClient.pause();
  commitAuthState(environment, auth);
  subscriptionClient.setAccessToken(accessToken);
  subscriptionClient.resume();
}

export async function deleteAccessTokenFromLocalStorage(
  localStorage: PromisifiedStorage
) {
  try {
    await localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch (err) {
    // TODO: (wyattjoh) add error reporting around this error
    // eslint-disable-next-line no-console
    console.error("could not remove access token from storage", err);
  }
  return undefined;
}
