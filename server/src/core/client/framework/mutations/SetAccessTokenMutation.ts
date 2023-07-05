import { Environment } from "relay-runtime";

import { replaceAccessTokenOnTheFly } from "coral-framework/lib/auth";
import { CoralContext } from "coral-framework/lib/bootstrap";
import { createMutation } from "coral-framework/lib/relay/mutation";

interface SetAccessTokenInput {
  /**
   * accessToken is the new access token to use for this session or persisted if
   * `ephemeral` is falsy.
   */
  accessToken: string | null;

  /**
   * ephemeral when set to true will ensure that the passed token is not
   * persisted to storage.
   */
  ephemeral?: boolean;

  /**
   * refresh when set will not terminate the session but just replace the current access token.
   */
  refresh?: boolean;
}

const SetAccessTokenMutation = createMutation(
  "setAccessToken",
  async (
    environment: Environment,
    { accessToken, ephemeral, refresh }: SetAccessTokenInput,
    { clearSession, subscriptionClient, localStorage }: CoralContext
  ) => {
    if (refresh) {
      if (!accessToken) {
        // eslint-disable-next-line no-console
        console.error("Empty token given when trying to refresh access token");
        return;
      }
      void replaceAccessTokenOnTheFly(
        environment,
        subscriptionClient,
        localStorage,
        accessToken,
        {
          ephemeral,
        }
      );
      return;
    }
    // Clear current session, as we are starting a new one.
    await clearSession(accessToken, { ephemeral });
  }
);

export default SetAccessTokenMutation;
