import { Environment } from "relay-runtime";

import { clearHash, getParamsFromHash } from "coral-framework/helpers";
import { CoralContext } from "coral-framework/lib/bootstrap";
import { initLocalBaseState } from "coral-framework/lib/relay";

import { INSTALL_ACCESS_TOKEN_KEY } from "../constants";

/**
 * Initializes the local state, before we start the App.
 */
export default async function initLocalState(
  environment: Environment,
  context: CoralContext
) {
  // Get the access token from the session storage.
  let accessToken = await context.sessionStorage.getItem(
    INSTALL_ACCESS_TOKEN_KEY
  );

  // Get all the parameters from the hash.
  const params = getParamsFromHash();
  if (params && params.accessToken) {
    // As there's an access token in the hash, let's clear it.
    clearHash();

    // Save the token in session storage to override what we found.
    accessToken = params.accessToken;
    await context.sessionStorage.setItem(INSTALL_ACCESS_TOKEN_KEY, accessToken);
  }

  await initLocalBaseState(environment, context, accessToken);
}
