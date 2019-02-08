import { Environment } from "relay-runtime";

import { TalkContext } from "talk-framework/lib/bootstrap";
import {
  commitLocalUpdatePromisified,
  createMutationContainer,
  setAccessTokenInLocalState,
} from "talk-framework/lib/relay";

export interface SetAccessTokenInput {
  accessToken: string | null;
}

export type SetAccessTokenMutation = (
  input: SetAccessTokenInput
) => Promise<void>;

export async function commit(
  environment: Environment,
  input: SetAccessTokenInput,
  { localStorage, clearSession }: TalkContext
) {
  await commitLocalUpdatePromisified(environment, async store => {
    setAccessTokenInLocalState(input.accessToken, store);
    if (input.accessToken) {
      await localStorage.setItem("accessToken", input.accessToken);
    } else {
      await localStorage.removeItem("accessToken");
    }
    // Clear current session, as we are starting a new one.
    await clearSession();
  });
}

export const withSetAccessTokenMutation = createMutationContainer(
  "setAccessToken",
  commit
);
