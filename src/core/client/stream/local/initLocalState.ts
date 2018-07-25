import qs from "query-string";
import { commitLocalUpdate, Environment } from "relay-runtime";

import {
  createAndRetain,
  LOCAL_ID,
  LOCAL_TYPE,
} from "talk-framework/lib/relay";

import { NETWORK_ID, NETWORK_TYPE } from "./constants";

/**
 * Initializes the local state, before we start the App.
 */
export default async function initLocalState(environment: Environment) {
  commitLocalUpdate(environment, s => {
    const root = s.getRoot();

    // Create the Local Record which is the Root for the client states.
    const localRecord = createAndRetain(environment, s, LOCAL_ID, LOCAL_TYPE);

    // Parse query params
    const query = qs.parse(location.search);

    if (query.assetID) {
      localRecord.setValue(query.assetID, "assetID");
    }

    if (query.commentID) {
      localRecord.setValue(query.commentID, "commentID");
    }

    // Create network Record
    const networkRecord = createAndRetain(
      environment,
      s,
      NETWORK_ID,
      NETWORK_TYPE
    );
    networkRecord.setValue(false, "isOffline");
    localRecord.setLinkedRecord(networkRecord, "network");
    root.setLinkedRecord(localRecord, "local");
  });
}
