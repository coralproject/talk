import { pick } from "lodash";
import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import { createMutationContainer } from "coral-framework/lib/relay";
import { signIn, SignInInput } from "coral-framework/rest";

export type SignInMutation = (input: SignInInput) => Promise<void>;

export async function commit(
  environment: Environment,
  input: SignInInput,
  { rest, clearSession }: CoralContext
) {
  const result = await signIn(rest, pick(input, ["email", "password"]));
  // Put the token on the hash and clean the session.
  // It'll be picked up by initLocalState.
  location.hash = `accessToken=${result.token}`;
  await clearSession();
  // TODO: (cvle) A better way would be if `context.clearSession` would return the new session and
  // we set the accessToken directly in there.
}

export const withSignInMutation = createMutationContainer("signIn", commit);
