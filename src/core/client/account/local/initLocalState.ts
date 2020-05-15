import { Environment } from "relay-runtime";

import { AuthState } from "coral-framework/lib/auth";
import { CoralContext } from "coral-framework/lib/bootstrap";
import { initLocalBaseState } from "coral-framework/lib/relay";

/**
 * Initializes the local state, before we start the App.
 */
export default async function initLocalState(
  environment: Environment,
  context: CoralContext,
  auth?: AuthState
) {
  initLocalBaseState(environment, context, auth);
}
