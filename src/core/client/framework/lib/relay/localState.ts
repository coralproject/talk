import {
  commitLocalUpdate,
  Environment,
  RecordSourceProxy,
} from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import { parseJWT } from "coral-framework/lib/jwt";
import { createAndRetain } from "coral-framework/lib/relay";

/**
 * The Root Record of Client-Side Schema Extension must be of this type.
 */
export const LOCAL_TYPE = "Local";

/**
 * The Root Record of Client-Side Schema Extension must have this id.
 */
export const LOCAL_ID = "client:root.local";

export function setAccessTokenInLocalState(
  accessToken: string | null,
  source: RecordSourceProxy
) {
  const localRecord = source.get(LOCAL_ID)!;
  localRecord.setValue(accessToken || "", "accessToken");
  if (accessToken) {
    const { payload } = parseJWT(accessToken);
    localRecord.setValue(payload.exp, "accessTokenExp");
    localRecord.setValue(payload.jti, "accessTokenJTI");
    // TODO: (cvle) maybe a timer to detect when accessToken has expired?
  } else {
    localRecord.setValue(null, "accessTokenExp");
    localRecord.setValue(null, "accessTokenJTI");
  }
}

export async function initLocalBaseState(
  environment: Environment,
  { localStorage }: CoralContext,
  accessToken?: string | null
) {
  commitLocalUpdate(environment, s => {
    const root = s.getRoot();

    // Create the Local Record which is the Root for the client states.
    const localRecord = createAndRetain(environment, s, LOCAL_ID, LOCAL_TYPE);
    root.setLinkedRecord(localRecord, "local");

    // Set access token
    setAccessTokenInLocalState(accessToken || null, s);
  });
}
