import { Environment } from "relay-runtime";

import { TalkContext } from "talk-framework/lib/bootstrap";
import {
  commitLocalUpdatePromisified,
  createMutationContainer,
} from "talk-framework/lib/relay";
import { LOCAL_ID } from "talk-framework/lib/relay/withLocalStateContainer";

export interface SetAuthTokenInput {
  authToken: string | null;
}

export type SetAuthTokenMutation = (input: SetAuthTokenInput) => Promise<void>;

export async function commit(
  environment: Environment,
  input: SetAuthTokenInput,
  { localStorage, clearSession }: TalkContext
) {
  return await commitLocalUpdatePromisified(environment, async store => {
    const record = store.get(LOCAL_ID)!;
    record.setValue(input.authToken, "authToken");
    if (input.authToken) {
      await localStorage.setItem("authToken", input.authToken);
    } else {
      await localStorage.removeItem("authToken");
    }
    // Clear current session, as we are starting a new one.
    clearSession();
  });
}

export const withSetAuthTokenMutation = createMutationContainer(
  "setCommentID",
  commit
);
