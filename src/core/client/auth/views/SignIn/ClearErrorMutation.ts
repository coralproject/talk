import { commitLocalUpdate, Environment } from "relay-runtime";

import { createMutationContainer, LOCAL_ID } from "coral-framework/lib/relay";

export type ClearErrorMutation = () => Promise<void>;

export async function commit(environment: Environment) {
  return commitLocalUpdate(environment, (store) => {
    const record = store.get(LOCAL_ID)!;
    record.setValue(null, "error");
  });
}

export const withClearErrorMutation = createMutationContainer(
  "clearError",
  commit
);
