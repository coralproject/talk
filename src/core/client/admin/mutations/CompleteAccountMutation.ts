import { Environment } from "relay-runtime";

import { TalkContext } from "talk-framework/lib/bootstrap";
import { createMutationContainer } from "talk-framework/lib/relay";
import { commit as setAuthToken } from "talk-framework/mutations/SetAuthTokenMutation";

interface CompleteAccountInput {
  authToken: string;
}
export type CompleteAccountMutation = (
  input: CompleteAccountInput
) => Promise<void>;

export async function commit(
  environment: Environment,
  input: CompleteAccountInput,
  context: TalkContext
) {
  await setAuthToken(environment, { authToken: input.authToken }, context);
}

export const withCompleteAccountMutation = createMutationContainer(
  "completeAccount",
  commit
);
