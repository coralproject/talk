import { commitLocalUpdate, Environment } from "relay-runtime";

import { createMutationContainer, LOCAL_ID } from "coral-framework/lib/relay";

export interface SetStreamOrderByInput {
  orderBy:
    | "CREATED_AT_ASC"
    | "CREATED_AT_DESC"
    | "REPLIES_DESC"
    | "REACTION_DESC"
    | "%future added value";
}

export type SetStreamOrderByMutation = (
  input: SetStreamOrderByInput
) => Promise<void>;

export async function commit(
  environment: Environment,
  input: SetStreamOrderByInput
) {
  return commitLocalUpdate(environment, store => {
    const record = store.get(LOCAL_ID)!;
    record.setValue(input.orderBy, "streamOrderBy");
  });
}

export const withSetStreamOrderByMutation = createMutationContainer(
  "setStreamOrderBy",
  commit
);
