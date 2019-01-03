import { commitLocalUpdate, Environment } from "relay-runtime";

import { parseQuery } from "talk-common/utils";
import { TalkContext } from "talk-framework/lib/bootstrap";
import { initLocalBaseState, LOCAL_ID } from "talk-framework/lib/relay";

function getParamsFromHashAndClearIt() {
  try {
    const params = window.location.hash
      ? parseQuery(window.location.hash.substr(1))
      : {};

    // Remove hash with token.
    if (window.location.hash) {
      window.history.replaceState(null, document.title, location.pathname);
    }

    return params;
  } catch (err) {
    window.console.error(err);
    return {};
  }
}

/**
 * Initializes the local state, before we start the App.
 */
export default async function initLocalState(
  environment: Environment,
  context: TalkContext
) {
  const { error = null, accessToken = null } = getParamsFromHashAndClearIt();

  if (error) {
    // FIXME: (wyattjoh) replace with actual error handling code.
    alert(error);
  }

  await initLocalBaseState(environment, context, accessToken);

  commitLocalUpdate(environment, s => {
    const localRecord = s.get(LOCAL_ID)!;

    // Parse query params
    const query = parseQuery(location.search);

    // Set default view.
    localRecord.setValue(query.view || "SIGN_IN", "view");
  });
}
