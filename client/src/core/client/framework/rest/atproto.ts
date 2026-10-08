import { FORM_ERROR } from "final-form";

export interface AtprotoHandleInput {
  handle: string;
}

/**
 * postAtprotoApiAuth sends a validated handle to the tenant's atproto auth
 * endpoint. It resolves to a form error when the request fails, so the form
 * can show it, and to undefined on success.
 */
export default async function postAtprotoApiAuth(
  input: AtprotoHandleInput,
  authPath: string
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

  return undefined;
}
