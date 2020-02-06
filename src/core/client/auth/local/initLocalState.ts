/* eslint-disable prettier/prettier */
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
    duplicateEmail: duplicateEmailFromHash = null,
  } = getParamsFromHashAndClearIt();

  await initLocalBaseState(environment, context, accessToken);

  if (duplicateEmailFromHash) {
    await context.sessionStorage.setItem(
      "duplicateEmail",
      duplicateEmailFromHash || ""
    );
  }
  const duplicateEmail =
    (await context.sessionStorage.getItem("duplicateEmail")) || null;

  commitLocalUpdate(environment, s => {
    const localRecord = s.get(LOCAL_ID)!;

    // Parse query params
    const query = parseQuery(location.search);

    // Set default view.
    localRecord.setValue(query.view || "SIGN_IN", "view");

    // Set error.
    localRecord.setValue(error, "error");

    // Set duplicateEmail.
    localRecord.setValue(
      duplicateEmail,
      "duplicateEmail"
    );
  });
}
