import { Environment } from "relay-runtime";

import { TalkContext } from "talk-framework/lib/bootstrap";
import { createMutationContainer } from "talk-framework/lib/relay";
import { signIn, SignInInput } from "talk-framework/rest";

export type SignInMutation = (input: SignInInput) => Promise<void>;

export async function commit(
  environment: Environment,
  input: SignInInput,
  { rest, postMessage }: TalkContext
) {
  try {
    const result = await signIn(rest, input);
    postMessage.send("setAuthToken", result.token, window.opener);
    window.close();
  } catch (err) {
    postMessage.send("authError", err.toString(), window.opener);
  }
}

export const withSignInMutation = createMutationContainer("signIn", commit);
