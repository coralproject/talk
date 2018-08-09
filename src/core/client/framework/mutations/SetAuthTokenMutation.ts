import { commitLocalUpdate, Environment } from "relay-runtime";

import { createMutationContainer } from "talk-framework/lib/relay";
import { LOCAL_ID } from "talk-framework/lib/relay/withLocalStateContainer";

export interface SetAuthTokenInput {
  authToken: string | null;
}

export type SetAuthTokenMutation = (input: SetAuthTokenInput) => Promise<void>;

export async function commit(
  environment: Environment,
  input: SetAuthTokenInput
) {
  return commitLocalUpdate(environment, store => {
    const record = store.get(LOCAL_ID)!;
    record.setValue(input.authToken, "authToken");

    // Force gc to trigger.
    environment
      .retain({
        dataID: "tmp",
        node: { selections: [] },
        variables: {},
      })
      .dispose();
  });
}

export const withSetAuthTokenMutation = createMutationContainer(
  "setCommentID",
  commit
);
