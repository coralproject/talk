import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitLocalUpdatePromisified,
  createMutation,
  setAccessTokenInLocalState,
} from "coral-framework/lib/relay";

interface SetAccessTokenInput {
  accessToken: string | null;
}

const SetAccessTokenMutation = createMutation(
  "setAccessToken",
  async (
    environment: Environment,
    input: SetAccessTokenInput,
    { localStorage, clearSession }: CoralContext
  ) => {
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
);

export default SetAccessTokenMutation;
