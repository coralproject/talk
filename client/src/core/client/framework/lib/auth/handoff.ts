import { PromisifiedStorage } from "coral-framework/lib/storage";

import { PostMessageService } from "../postMessage";
import { RestClient } from "../rest";

/**
 * The auth handoff passes the access token from the sign in popup to the page
 * that opened it, through the server, for when the popup has lost
 * `window.opener`. That happens when a sign in page it visited sends
 * `Cross-Origin-Opener-Policy: same-origin`, as bsky.social does.
 *
 * 1. The page creates a random ID and adds it to the popup's URL. The popup
 *    keeps it in sessionStorage, which survives the trip to the sign in
 *    provider and back.
 * 2. The popup sends the ID with the request that starts sign in, so the
 *    server knows a sign in for it was started. Just before the popup leaves for the sign in provider, while it can still
 *    reach the page, it tells the page (AUTH_HANDOFF_STARTED).
 * 3. The page makes a single request that the server holds open until the
 *    popup stores its token under the ID when sign in completes.
 *
 * Nothing happens unless a sign in that leaves the popup is started, and if it
 * never completes, the one request ends and nothing is retried.
 */

export const AUTH_HANDOFF_PARAM = "handoff";

/** The postMessage the popup sends the page before it leaves to sign in. */
export const AUTH_HANDOFF_STARTED = "authHandoffStarted";

const STORAGE_KEY = "authHandoff";

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
 * getAuthHandoffID returns this popup's handoff ID, to send with the request
 * that starts sign in. It returns undefined when there's no opener (e.g. the
 * admin's full page sign in) or no handoff ID.
 */
export async function getAuthHandoffID(
  window: Window,
  sessionStorage: PromisifiedStorage
) {
  if (!window.opener) {
    return undefined;
  }

  return (await sessionStorage.getItem(STORAGE_KEY)) || undefined;
}

/**
 * announceAuthHandoff tells the page that opened this popup that the popup is
 * about to leave for a sign in provider, so the page can wait for the token.
 * It does nothing when there's no opener (e.g. the admin's full page sign in)
 * or no handoff ID.
 */
export async function announceAuthHandoff(
  window: Window,
  postMessage: PostMessageService,
  sessionStorage: PromisifiedStorage
) {
  const opener = window.opener as Window | null | undefined;
  if (!opener) {
    return;
  }

  const id = await sessionStorage.getItem(STORAGE_KEY);
  if (!id) {
    return;
  }

  postMessage.send(AUTH_HANDOFF_STARTED, id, opener, "*");
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
 * waitForAuthHandoff makes one request that the server holds open until a
 * token is handed off under the ID, and calls onToken if one arrives. It is
 * not retried. It returns a function that stops waiting.
 */
export function waitForAuthHandoff(
  rest: RestClient,
  id: string,
  onToken: (accessToken: string) => void
) {
  const controller = new AbortController();

  rest
    .fetch<{ token?: string } | "">(`/auth/handoff/${id}`, {
      method: "GET",
      signal: controller.signal,
    })
    .then(
      (result) => {
        if (
          !controller.signal.aborted &&
          result &&
          typeof result.token === "string"
        ) {
          onToken(result.token);
        }
      },
      () => {
        // Aborted, timed out, or the server couldn't be reached. Not retried,
        // the user can sign in again.
      }
    );

  return () => controller.abort();
}
