import { Environment } from "relay-runtime";

import { clearHash, getParamsFromHash } from "coral-framework/helpers";
import { CoralContext } from "coral-framework/lib/bootstrap";
import { initLocalBaseState } from "coral-framework/lib/relay";

/**
 * Initializes the local state, before we start the App.
 */
export default async function initLocalState(
  environment: Environment,
  context: CoralContext
) {
  // Get all the parameters from the hash.
  const params = getParamsFromHash();
  if (params && params.accessToken) {
    // As there's an access token in the hash, let's clear it.
    clearHash();

    // Save the token in storage.
    context.auth.set(params.accessToken);
  }

  initLocalBaseState(environment, context);
}
