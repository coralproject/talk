import { commitLocalUpdate, Environment } from "relay-runtime";

import { createAndRetain } from "coral-framework/lib/relay";

import { AuthState } from "../auth";
import { CoralContext } from "../bootstrap";

/**
 * The Root Record of Client-Side Schema Extension must be of this type.
 */
export const LOCAL_TYPE = "Local";

/**
 * The Root Record of Client-Side Schema Extension must have this id.
 */
export const LOCAL_ID = "client:root.local";

/**
 * initLocalBaseState will initialize the local base relay state. If as a part
 * of your target you need to change the auth state, you can do so by passing a
 * new auth state object into this function when committing.
 *
 * @param environment the initialized relay environment
 * @param context application context
 * @param auth application auth state
 */
export function initLocalBaseState(
  environment: Environment,
  context: CoralContext,
  auth?: AuthState
) {
  commitLocalUpdate(environment, (source) => {
    const root = source.getRoot();

    // Create the Local Record which is the Root for the client states.
    const local = createAndRetain(environment, source, LOCAL_ID, LOCAL_TYPE);

    root.setLinkedRecord(local, "local");

    // Update the access token properties.
    local.setValue(auth?.accessToken, "accessToken");

    // Update the claims.
    local.setValue(auth?.claims.exp, "accessTokenExp");
    local.setValue(auth?.claims.jti, "accessTokenJTI");
  });
}
