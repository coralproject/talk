import { commitLocalUpdate, Environment } from "relay-runtime";

import { createMutationContainer, LOCAL_ID } from "talk-framework/lib/relay";

export interface SetRedirectPathInput {
  path: string | null;
}

export type SetRedirectPathMutation = (
  input: SetRedirectPathInput
) => Promise<void>;

export async function commit(
  environment: Environment,
  input: SetRedirectPathInput
) {
  return commitLocalUpdate(environment, store => {
    const record = store.get(LOCAL_ID)!;
    record.setValue(input.path, "redirectPath");
  });
}

export const withSetRedirectPathMutation = createMutationContainer(
  "setRedirectPath",
  commit
);
