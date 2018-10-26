import { Environment } from "relay-runtime";

import { TalkContext } from "talk-framework/lib/bootstrap";
import { createMutationContainer } from "talk-framework/lib/relay";
import { commit as setAuthToken } from "talk-framework/mutations/SetAuthTokenMutation";
import { signIn, SignInInput } from "talk-framework/rest";

export type SignInMutation = (input: SignInInput) => Promise<void>;

export async function commit(
  environment: Environment,
  input: SignInInput,
  context: TalkContext
) {
  const result = await signIn(context.rest, input);
  setAuthToken(environment, { authToken: result.token }, context);
}

export const withSignInMutation = createMutationContainer("signIn", commit);
