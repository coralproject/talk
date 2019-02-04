import { commitLocalUpdate, Environment } from "relay-runtime";

import { createMutationContainer } from "talk-framework/lib/relay";
import { LOCAL_ID } from "talk-framework/lib/relay/withLocalStateContainer";

export type ClearAuthErrorMutation = () => Promise<void>;

export async function commit(environment: Environment, input: undefined) {
  return commitLocalUpdate(environment, store => {
    const record = store.get(LOCAL_ID)!;
    record.setValue(null, "authError");
  });
}

export const withClearAuthErrorMutation = createMutationContainer(
  "clearAuthError",
  commit
);
