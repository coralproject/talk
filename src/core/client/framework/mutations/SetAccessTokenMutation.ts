import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import { createMutation } from "coral-framework/lib/relay";

interface SetAccessTokenInput {
  accessToken: string | null;
}

const SetAccessTokenMutation = createMutation(
  "setAccessToken",
  async (
    environment: Environment,
    input: SetAccessTokenInput,
    { clearSession }: CoralContext
  ) => {
    // Clear current session, as we are starting a new one.
    await clearSession(input.accessToken);
  }
);

export default SetAccessTokenMutation;
