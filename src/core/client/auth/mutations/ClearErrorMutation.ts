import { commitLocalUpdate, Environment } from "relay-runtime";

import { TalkContext } from "talk-framework/lib/bootstrap";
import { createMutationContainer } from "talk-framework/lib/relay";
import { LOCAL_ID } from "talk-framework/lib/relay/withLocalStateContainer";

export type ClearErrorMutation = () => Promise<void>;

export async function commit(
  environment: Environment,
  input: undefined,
  { pym }: TalkContext
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
