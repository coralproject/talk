import { pick } from "lodash";
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
    await signUp(rest, pick(input, "email", "password", "username"));
  } catch (err) {
    throw err;
  }
}

export const withSignUpMutation = createMutationContainer("signUp", commit);
