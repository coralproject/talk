import { commitLocalUpdate, Environment } from "relay-runtime";

import { TalkContext } from "talk-framework/lib/bootstrap";
import { createMutationContainer } from "talk-framework/lib/relay";
import { LOCAL_ID } from "talk-framework/lib/relay/withLocalStateContainer";

export interface SetAuthTokenInput {
  authToken: string | null;
}

export type SetAuthTokenMutation = (input: SetAuthTokenInput) => Promise<void>;

export async function commit(
  environment: Environment,
  input: SetAuthTokenInput,
  { localStorage, pymLocalStorage }: TalkContext
) {
  return commitLocalUpdate(environment, store => {
    const record = store.get(LOCAL_ID)!;
    record.setValue(input.authToken, "authToken");
    const storage = pymLocalStorage || localStorage;
    if (input.authToken) {
      storage.setItem("authToken", input.authToken);
    } else {
      storage.removeItem("authToken");
    }
    // Increment auth revision to indicate a change in auth state.
    record.setValue(record.getValue("authRevision") + 1, "authRevision");

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
