import {
  commitLocalUpdate,
  Environment,
  RecordSourceProxy,
} from "relay-runtime";

import Auth from "coral-framework/lib/auth";
import { createAndRetain } from "coral-framework/lib/relay";

import { CoralContext } from "../bootstrap";

/**
 * The Root Record of Client-Side Schema Extension must be of this type.
 */
export const LOCAL_TYPE = "Local";

/**
 * The Root Record of Client-Side Schema Extension must have this id.
 */
export const LOCAL_ID = "client:root.local";

export function syncAuthWithLocalState(environment: Environment, auth: Auth) {
  // Attach a listener to access token changes to update the local graph.
  return auth.onChange(() => {
    commitLocalUpdate(environment, (source) => {
      setAccessTokenRecordValues(source, auth);
    });
  });
}

function setAccessTokenRecordValues(source: RecordSourceProxy, auth: Auth) {
  // Get the local record.
  const localRecord = source.get(LOCAL_ID)!;

  // Update the access token properties.
  const accessToken = auth.getAccessToken();
  localRecord.setValue(accessToken, "accessToken");

  // Update the claims.
  const { jti = null, exp = null } = auth.getClaims();
  localRecord.setValue(exp, "accessTokenExp");
  localRecord.setValue(jti, "accessTokenJTI");
}

export function initLocalBaseState(
  environment: Environment,
  context: CoralContext
) {
  commitLocalUpdate(environment, (s) => {
    const root = s.getRoot();

    // Create the Local Record which is the Root for the client states.
    const localRecord = createAndRetain(environment, s, LOCAL_ID, LOCAL_TYPE);
    root.setLinkedRecord(localRecord, "local");

    setAccessTokenRecordValues(s, context.auth);
  });
}
