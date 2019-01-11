import { commitLocalUpdate, Environment } from "relay-runtime";

import { createMutationContainer } from "talk-framework/lib/relay";
import { LOCAL_ID } from "talk-framework/lib/relay/withLocalStateContainer";

export interface SetAuthErrorInput {
  authError: string;
}
export type SetAuthErrorMutation = (input: SetAuthErrorInput) => Promise<void>;

export async function commit(
  environment: Environment,
  input: SetAuthErrorInput
) {
  return commitLocalUpdate(environment, store => {
    const record = store.get(LOCAL_ID)!;
    record.setValue(input.authError, "authError");
  });
}

export const withSetAuthErrorMutation = createMutationContainer(
  "setAuthError",
  commit
);
