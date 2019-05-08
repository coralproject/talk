import {
  commitLocalUpdate,
  Environment,
  RecordSourceProxy,
} from "relay-runtime";

import { TalkContext } from "talk-framework/lib/bootstrap";
import { parseJWT } from "talk-framework/lib/jwt";
import { createAndRetain } from "talk-framework/lib/relay";

/**
 * The Root Record of Client-Side Schema Extension must be of this type.
 */
export const LOCAL_TYPE = "Local";

/**
 * The Root Record of Client-Side Schema Extension must have this id.
 */
export const LOCAL_ID = "client:root.local";

export const NETWORK_TYPE = "Network";
export const NETWORK_ID = "client:root.local.network";

export function setAccessTokenInLocalState(
  accessToken: string | null,
  source: RecordSourceProxy
) {
  const localRecord = source.get(LOCAL_ID)!;
  if (accessToken) {
    const { payload, expired } = parseJWT(accessToken);
    localRecord.setValue(accessToken || "", "accessToken");
    localRecord.setValue(payload.exp, "accessTokenExp");
    localRecord.setValue(payload.jti, "accessTokenJTI");
    localRecord.setValue(!expired, "loggedIn");
  } else {
    localRecord.setValue(null, "accessTokenExp");
    localRecord.setValue(null, "accessTokenJTI");
    localRecord.setValue(false, "loggedIn");
  }
}

export async function initLocalBaseState(
  environment: Environment,
  { localStorage }: TalkContext,
  accessToken?: string | null
) {
  if (accessToken === undefined) {
    accessToken = await localStorage!.getItem("accessToken");
  }

  commitLocalUpdate(environment, s => {
    const root = s.getRoot();

    // Create the Local Record which is the Root for the client states.
    const localRecord = createAndRetain(environment, s, LOCAL_ID, LOCAL_TYPE);
    root.setLinkedRecord(localRecord, "local");

    // Set auth token
    setAccessTokenInLocalState(accessToken || null, s);

    // Create network Record
    const networkRecord = createAndRetain(
      environment,
      s,
      NETWORK_ID,
      NETWORK_TYPE
    );
    networkRecord.setValue(false, "isOffline");
    localRecord.setLinkedRecord(networkRecord, "network");
  });
}
