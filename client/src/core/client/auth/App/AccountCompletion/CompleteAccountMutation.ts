import { Environment } from "relay-runtime";

import { handOffAccessToken } from "coral-framework/lib/auth/handoff";
import { CoralContext } from "coral-framework/lib/bootstrap";
import { createMutation } from "coral-framework/lib/relay";

export interface CompleteAccountInput {
  accessToken: string;
}

export async function commit(
  environment: Environment,
  input: CompleteAccountInput,
  { postMessage, window, rest, sessionStorage }: CoralContext
) {
  const opener = window.opener as Window | null | undefined;

  if (opener) {
    postMessage.send("setAccessToken", input.accessToken, opener, "*");
  } else {
    // A sign in page we visited cut this popup off from the page that opened
    // it, so pass the token to that page through the server instead.
    await handOffAccessToken(rest, sessionStorage, input.accessToken);
  }

  window.close();
}

const CompleteAccountMutation = createMutation("completeAccount", commit);

export default CompleteAccountMutation;
