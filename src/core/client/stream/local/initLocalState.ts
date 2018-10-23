import qs from "query-string";
import { commitLocalUpdate, Environment } from "relay-runtime";

import { TalkContext } from "talk-framework/lib/bootstrap";
import {
  createAndRetain,
  LOCAL_ID,
  LOCAL_TYPE,
} from "talk-framework/lib/relay";

import {
  AUTH_POPUP_ID,
  AUTH_POPUP_TYPE,
  NETWORK_ID,
  NETWORK_TYPE,
} from "./constants";

/**
 * Initializes the local state, before we start the App.
 */
export default async function initLocalState(
  environment: Environment,
  { localStorage }: TalkContext
) {
  const authToken = await localStorage!.getItem("authToken");

  commitLocalUpdate(environment, s => {
    // TODO: (cvle) move local, auth token and network initialization to framework.
    const root = s.getRoot();

    // Create the Local Record which is the Root for the client states.
    const localRecord = createAndRetain(environment, s, LOCAL_ID, LOCAL_TYPE);
    root.setLinkedRecord(localRecord, "local");

    // Set auth token
    localRecord.setValue(authToken || "", "authToken");

    // Parse query params
    const query = qs.parse(location.search);

    if (query.assetID) {
      localRecord.setValue(query.assetID, "assetID");
    }

    if (query.assetURL) {
      localRecord.setValue(query.assetURL, "assetURL");
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

    // Create authPopup Record
    const authPopupRecord = createAndRetain(
      environment,
      s,
      AUTH_POPUP_ID,
      AUTH_POPUP_TYPE
    );
    authPopupRecord.setValue(false, "open");
    authPopupRecord.setValue(false, "focus");
    authPopupRecord.setValue("", "href");
    localRecord.setLinkedRecord(authPopupRecord, "authPopup");

    // Set active tab
    localRecord.setValue("COMMENTS", "activeTab");

    // Set sort
    localRecord.setValue("CREATED_AT_DESC", "defaultStreamOrderBy");
  });
}
