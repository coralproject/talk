import { Environment } from "relay-runtime";

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
    const result = await signUp(rest, input);
    postMessage.send("setAuthToken", result.token, window.opener);
    window.close();
  } catch (err) {
    postMessage.send("authError", err.toString(), window.opener);
  }
}

export const withSignUpMutation = createMutationContainer("signUp", commit);
