import { commitLocalUpdate, Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import { createMutationContainer } from "coral-framework/lib/relay";
import { LOCAL_ID } from "coral-framework/lib/relay";

export type ClearErrorMutation = () => Promise<void>;

export async function commit(
  environment: Environment,
  input: undefined,
  { pym }: CoralContext
) {
  return commitLocalUpdate(environment, store => {
    const record = store.get(LOCAL_ID)!;
    record.setValue(null, "error");
  });
}

export const withClearErrorMutation = createMutationContainer(
  "clearError",
  commit
);
