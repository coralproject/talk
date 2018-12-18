import { pick } from "lodash";
import { Environment } from "relay-runtime";

import { sendAuthError, sendAuthToken } from "talk-auth/helpers";
import { TalkContext } from "talk-framework/lib/bootstrap";
import { createMutationContainer } from "talk-framework/lib/relay";
import { signUp, SignUpInput } from "talk-framework/rest";

export type SignUpMutation = (input: SignUpInput) => Promise<void>;

export async function commit(
  environment: Environment,
  input: SignUpInput,
  { rest, postMessage }: TalkContext
) {
  try {
    const result = await signUp(
      rest,
      pick(input, "email", "password", "username")
    );
    sendAuthToken(postMessage, result.token);
    window.close();
  } catch (err) {
    sendAuthError(postMessage, err.toString());
    throw err;
  }
}

export const withSignUpMutation = createMutationContainer("signUp", commit);
