import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import { createMutationContainer } from "coral-framework/lib/relay";

export interface CompleteAccountInput {
  accessToken: string;
}
export type CompleteAccountMutation = (
  input: CompleteAccountInput
) => Promise<void>;

export async function commit(
  environment: Environment,
  input: CompleteAccountInput,
  { postMessage }: CoralContext
) {
  postMessage.send("setAccessToken", input.accessToken, window.opener);
  window.close();
}

export const withCompleteAccountMutation = createMutationContainer(
  "completeAccount",
  commit
);
