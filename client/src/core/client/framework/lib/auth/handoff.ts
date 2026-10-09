import { PromisifiedStorage } from "coral-framework/lib/storage";

import { RestClient } from "../rest";

/**
 * The auth handoff passes the access token from the sign in popup to the page
 * that opened it, through the server, for when the popup has lost
 * `window.opener`. That happens when a sign in page it visited sends
 * `Cross-Origin-Opener-Policy: same-origin`, as bsky.social does.
 *
 * The page creates a random ID and adds it to the popup's URL. The popup keeps
 * it in sessionStorage, which survives the trip to the sign in provider and
 * back, and stores its token on the server under it. The page polls for it.
 */

export const AUTH_HANDOFF_PARAM = "handoff";

const STORAGE_KEY = "authHandoff";

// How often, and for how long, the page checks for a handed off token.
const POLL_INTERVAL = 2000;
const POLL_TIMEOUT = 5 * 60 * 1000;

/**
 * createAuthHandoffID returns 32 random bytes, base64url encoded (43 chars).
 */
export function createAuthHandoffID(window: Window) {
  const bytes = new Uint8Array(32);
  window.crypto.getRandomValues(bytes);

  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });

  return window
    .btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * rememberAuthHandoffID keeps the popup's handoff ID from its URL, if any.
 */
export async function rememberAuthHandoffID(
  window: Window,
  sessionStorage: PromisifiedStorage
) {
  const id = new URLSearchParams(window.location.search).get(
    AUTH_HANDOFF_PARAM
  );
  if (id) {
    await sessionStorage.setItem(STORAGE_KEY, id);
  }
}

/**
 * handOffAccessToken stores the token on the server for the page to pick up.
 * It returns false when this popup has no handoff ID.
 */
export async function handOffAccessToken(
  rest: RestClient,
  sessionStorage: PromisifiedStorage,
  accessToken: string
) {
  const id = await sessionStorage.getItem(STORAGE_KEY);
  if (!id) {
    return false;
  }

  await sessionStorage.removeItem(STORAGE_KEY);
  await rest.fetch("/auth/handoff", {
    method: "POST",
    body: { id },
    token: accessToken,
  });

  return true;
}

/**
 * pollForAuthHandoff checks for a token handed off under the ID, and calls
 * onToken once if one arrives. It stops early when shouldStop returns true,
 * and returns a function that stops polling.
 */
export function pollForAuthHandoff(
  rest: RestClient,
  id: string,
  onToken: (accessToken: string) => void,
  shouldStop: () => boolean = () => false
) {
  let stopped = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  const startedAt = Date.now();

  const stop = () => {
    stopped = true;
    if (timer) {
      clearTimeout(timer);
    }
  };

  const check = async () => {
    if (stopped || shouldStop() || Date.now() - startedAt > POLL_TIMEOUT) {
      return;
    }

    try {
      const result = await rest.fetch<{ token?: string } | "">(
        `/auth/handoff/${id}`,
        { method: "GET" }
      );
      if (!stopped && result && typeof result.token === "string") {
        stop();
        onToken(result.token);
        return;
      }
    } catch {
      // Keep trying until the timeout, the server may be briefly unreachable.
    }

    if (!stopped) {
      timer = setTimeout(() => void check(), POLL_INTERVAL);
    }
  };

  timer = setTimeout(() => void check(), POLL_INTERVAL);

  return stop;
}
