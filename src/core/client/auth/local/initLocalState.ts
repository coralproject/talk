import { commitLocalUpdate, Environment } from "relay-runtime";

import { parseQuery } from "coral-common/utils";
import { getParamsFromHashAndClearIt } from "coral-framework/helpers";
import { CoralContext } from "coral-framework/lib/bootstrap";
import { initLocalBaseState, LOCAL_ID } from "coral-framework/lib/relay";

/**
 * Initializes the local state, before we start the App.
 */
export default async function initLocalState(
  environment: Environment,
  context: CoralContext
) {
  const {
    error = null,
    accessToken = null,
    // TODO: use the duplicateEmail here and set it in session storage
    // duplicateEmail = null,
  } = getParamsFromHashAndClearIt();

  await initLocalBaseState(environment, context, accessToken);

  commitLocalUpdate(environment, s => {
    const localRecord = s.get(LOCAL_ID)!;

    // Parse query params
    const query = parseQuery(location.search);

    // Set default view.
    localRecord.setValue(query.view || "SIGN_IN", "view");

    // Set error.
    localRecord.setValue(error, "error");
  });
}
