import { pick } from "lodash";
import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import { createMutationContainer } from "coral-framework/lib/relay";
import { signUp, SignUpInput } from "coral-framework/rest";

export type SignUpMutation = (input: SignUpInput) => Promise<void>;

export async function commit(
  environment: Environment,
  input: SignUpInput,
  { rest, clearSession }: CoralContext
) {
  const result = await signUp(
    rest,
    pick(input, ["email", "password", "username"])
  );
  // Put the token on the hash and clean the session.
  // It'll be picked up by initLocalState.
  location.hash = `accessToken=${result.token}`;
  await clearSession();
}

export const withSignUpMutation = createMutationContainer("signUp", commit);
