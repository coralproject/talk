import { pick } from "lodash";
import { Environment } from "relay-runtime";

import { TalkContext } from "talk-framework/lib/bootstrap";
import { createMutationContainer } from "talk-framework/lib/relay";
import { signIn, SignInInput } from "talk-framework/rest";

export type SignInMutation = (input: SignInInput) => Promise<void>;

export async function commit(
  environment: Environment,
  input: SignInInput,
  { rest, clearSession }: TalkContext
) {
  const result = await signIn(rest, pick(input, ["email", "password"]));
  // Put the token on the hash and clean the session.
  // It'll be picked up by initLocalState.
  location.hash = `accessToken=${result.token}`;
  await clearSession();
}

export const withSignInMutation = createMutationContainer("signIn", commit);
