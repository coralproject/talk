import qs from "query-string";
import { commitLocalUpdate, Environment } from "relay-runtime";

import { TalkContext } from "talk-framework/lib/bootstrap";
import { createAndRetain, initLocalBaseState } from "talk-framework/lib/relay";

import { AUTH_POPUP_ID, AUTH_POPUP_TYPE } from "./constants";

/**
 * Initializes the local state, before we start the App.
 */
export default async function initLocalState(
  environment: Environment,
  context: TalkContext
) {
  await initLocalBaseState(environment, context);
  commitLocalUpdate(environment, s => {
    const root = s.getRoot();
    const localRecord = root.getLinkedRecord("local")!;

    // Parse query params
    const query = qs.parse(location.search);

    if (query.storyID) {
      localRecord.setValue(query.storyID, "storyID");
    }

    if (query.storyURL) {
      localRecord.setValue(query.storyURL, "storyURL");
    }

    if (query.commentID) {
      localRecord.setValue(query.commentID, "commentID");
    }

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
  });
}
