import { FORM_ERROR } from "final-form";

export interface AtprotoHandleInput {
  handle: string;
  /** The sign in popup's handoff ID, see the auth handoff. */
  handoff?: string;
}

/**
 * postAtprotoApiAuth sends a validated handle to the tenant's atproto auth
 * endpoint, then sends the browser to the authorization URL it replies with.
 * beforeRedirect runs just before leaving, while this window can still reach
 * the page that opened it. It resolves to a form error when the request
 * fails, so the form can show it.
 */
export default async function postAtprotoApiAuth(
  input: AtprotoHandleInput,
  authPath: string,
  window: Window,
  beforeRedirect?: () => Promise<void>
) {
  let resp: Response;
  try {
    resp = await fetch(authPath, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify(input),
    });
  } catch (err) {
    // The request never got a response.
    return { [FORM_ERROR]: "Unable to reach the server, please try again." };
  }

  if (!resp.ok) {
    // Prefer the server's error message when it sends one.
    let message = `Sign in failed (${resp.status})`;
    try {
      const body = await resp.json();
      if (typeof body?.error === "string") {
        message = body.error;
      } else if (typeof body?.error?.message === "string") {
        message = body.error.message;
      }
    } catch (err) {
      // Not JSON, keep the status message.
    }
    return { [FORM_ERROR]: message };
  }

  let url: unknown;
  try {
    ({ url } = await resp.json());
  } catch (err) {
    // Handled below.
  }
  if (typeof url !== "string" || !url.startsWith("https://")) {
    return { [FORM_ERROR]: "Sign in failed, please try again." };
  }

  if (beforeRedirect) {
    await beforeRedirect();
  }

  // Leave the page for the user's authorization server.
  window.location.href = url;
  return undefined;
}
