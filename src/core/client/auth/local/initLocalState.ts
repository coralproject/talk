import { commitLocalUpdate, Environment } from "relay-runtime";

import { parseQuery } from "coral-common/utils";
import { getParamsFromHashAndClearIt } from "coral-framework/helpers";
import {
  AuthState,
  storeAccessTokenInLocalStorage,
} from "coral-framework/lib/auth";
import { CoralContext } from "coral-framework/lib/bootstrap";
import { initLocalBaseState, LOCAL_ID } from "coral-framework/lib/relay";

/**
 * Initializes the local state, before we start the App.
 */
export default async function initLocalState(
  environment: Environment,
  context: CoralContext,
  auth: AuthState | null = null
) {
  const { error = null, accessToken = null } = getParamsFromHashAndClearIt();

  if (accessToken) {
    auth = storeAccessTokenInLocalStorage(accessToken);
  }

  initLocalBaseState(environment, context, auth);

  commitLocalUpdate(environment, (s) => {
    const localRecord = s.get(LOCAL_ID)!;

    // Parse query params
    const query = parseQuery(location.search);

    // Set default view.
    localRecord.setValue(query.view || "SIGN_IN", "view");

    // Set error.
    localRecord.setValue(error, "error");
  });
}
