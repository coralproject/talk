import { commitLocalUpdate, Environment } from "relay-runtime";

import { createMutationContainer } from "talk-framework/lib/relay";

import { NETWORK_ID } from "../lib/relay/localState";

export interface SetNetworkStatusInput {
  isOffline: boolean;
}

export type SetNetworkStatusMutation = (
  input: SetNetworkStatusInput
) => Promise<void>;

export async function commit(
  environment: Environment,
  input: SetNetworkStatusInput
) {
  return commitLocalUpdate(environment, store => {
    const record = store.get(NETWORK_ID)!;
    record.setValue(input.isOffline, "isOffline");
  });
}

export const withSetNetworkStatusMutation = createMutationContainer(
  "setNetworkStatus",
  commit
);
