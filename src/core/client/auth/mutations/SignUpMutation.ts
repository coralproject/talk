import { pick } from "lodash";
import { Environment } from "relay-runtime";

import { TalkContext } from "talk-framework/lib/bootstrap";
import { createMutationContainer } from "talk-framework/lib/relay";
import { signUp, SignUpInput } from "talk-framework/rest";

export type SignUpMutation = (input: SignUpInput) => Promise<void>;

export async function commit(
  environment: Environment,
  input: SignUpInput,
  { rest, clearSession }: TalkContext
) {
  const result = await signUp(
    rest,
    pick(input, ["email", "password", "username"])
  );
  // Put the token on the hash and clean the session.
  // It'll be picked up by initLocalState.
  location.hash = result.token;
  clearSession();
}

export const withSignUpMutation = createMutationContainer("signUp", commit);
