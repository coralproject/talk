import { commitLocalUpdate, Environment } from "relay-runtime";

import { createMutationContainer, LOCAL_ID } from "talk-framework/lib/relay";

export interface SetActiveTabInput {
  tab: "COMMENTS" | "PROFILE" | string;
}

export type SetActiveTabMutation = (input: SetActiveTabInput) => Promise<void>;

export async function commit(
  environment: Environment,
  input: SetActiveTabInput
) {
  return commitLocalUpdate(environment, store => {
    const record = store.get(LOCAL_ID)!;
    record.setValue(input.tab, "activeTab");
  });
}

export const withSetActiveTabMutation = createMutationContainer(
  "setActiveTab",
  commit
);
