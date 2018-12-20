import { Environment } from "relay-runtime";

import { TalkContext } from "talk-framework/lib/bootstrap";
import { createMutationContainer } from "talk-framework/lib/relay";

export interface CompleteAccountInput {
  authToken: string;
}
export type CompleteAccountMutation = (
  input: CompleteAccountInput
) => Promise<void>;

export async function commit(
  environment: Environment,
  input: CompleteAccountInput,
  { postMessage }: TalkContext
) {
  postMessage.send("setAuthToken", input.authToken, window.opener);
  window.close();
}

export const withCompleteAccountMutation = createMutationContainer(
  "completeAccount",
  commit
);
