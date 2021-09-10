import { commitLocalUpdate } from "relay-runtime";

import { parseQuery } from "coral-common/utils";
import { getParamsFromHashAndClearIt } from "coral-framework/helpers";
import { parseAccessToken } from "coral-framework/lib/auth";
import { InitLocalState } from "coral-framework/lib/bootstrap/createManaged";
import { initLocalBaseState, LOCAL_ID } from "coral-framework/lib/relay";

/**
 * Initializes the local state, before we start the App.
 */
const initLocalState: InitLocalState = async ({
  environment,
  auth = null,
  context,
  ...rest
}) => {
  const { error = null, accessToken = null } = getParamsFromHashAndClearIt(
    context.window
  );

  if (accessToken) {
    // If there was an access token, parse it.
    // `OnPostMessageSetAccessToken` will take care of storing it.
    auth = parseAccessToken(accessToken);
  }

  await initLocalBaseState({ environment, auth, context, ...rest });

  commitLocalUpdate(environment, (s) => {
    const localRecord = s.get(LOCAL_ID)!;

    // Parse query params
    const query = parseQuery(location.search);

    // Set default view.
    localRecord.setValue(query.view || "SIGN_IN", "view");

    // Set error.
    localRecord.setValue(error, "error");
  });
};

export default initLocalState;
