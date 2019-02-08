import { Environment } from "relay-runtime";

import { TalkContext } from "talk-framework/lib/bootstrap";
import { createMutationContainer } from "talk-framework/lib/relay";
import { commit as setAccessToken } from "talk-framework/mutations/SetAccessTokenMutation";

interface CompleteAccountInput {
  accessToken: string;
}
export type CompleteAccountMutation = (
  input: CompleteAccountInput
) => Promise<void>;

export async function commit(
  environment: Environment,
  input: CompleteAccountInput,
  context: TalkContext
) {
  await setAccessToken(
    environment,
    { accessToken: input.accessToken },
    context
  );
}

export const withCompleteAccountMutation = createMutationContainer(
  "completeAccount",
  commit
);
