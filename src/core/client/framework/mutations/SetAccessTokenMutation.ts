import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import { createMutation } from "coral-framework/lib/relay";

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
}

const SetAccessTokenMutation = createMutation(
  "setAccessToken",
  async (
    environment: Environment,
    { accessToken, ephemeral }: SetAccessTokenInput,
    { clearSession }: CoralContext
  ) => {
    // Clear current session, as we are starting a new one.
    await clearSession(accessToken, ephemeral);
  }
);

export default SetAccessTokenMutation;
