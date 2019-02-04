import { commitLocalUpdate, Environment } from "relay-runtime";

import { parseQuery } from "talk-common/utils";
import { getParamsFromHashAndClearIt } from "talk-framework/helpers";
import { TalkContext } from "talk-framework/lib/bootstrap";
import { initLocalBaseState, LOCAL_ID } from "talk-framework/lib/relay";

/**
 * Initializes the local state, before we start the App.
 */
export default async function initLocalState(
  environment: Environment,
  context: TalkContext
) {
  const { error = null, accessToken = null } = getParamsFromHashAndClearIt();

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
