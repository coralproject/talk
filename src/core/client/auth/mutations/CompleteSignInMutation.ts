import { Environment } from "relay-runtime";

import { sendAuthError, sendAuthToken } from "talk-auth/helpers";
import { TalkContext } from "talk-framework/lib/bootstrap";
import { createMutationContainer } from "talk-framework/lib/relay";

export interface CompleteSignInInput {
  authToken: string;
}
export type CompleteSignInMutation = (
  input: CompleteSignInInput
) => Promise<void>;

export async function commit(
  environment: Environment,
  input: CompleteSignInInput,
  { postMessage }: TalkContext
) {
  try {
    sendAuthToken(postMessage, input.authToken);
    window.close();
  } catch (err) {
    sendAuthError(postMessage, err.toString());
    throw err;
  }
}

export const withCompleteSignInMutation = createMutationContainer(
  "completeSignIn",
  commit
);
