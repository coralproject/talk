import { commitLocalUpdate, Environment } from "relay-runtime";

import { parseQuery } from "coral-common/utils";
import { CoralContext } from "coral-framework/lib/bootstrap";
import { getExternalConfig } from "coral-framework/lib/externalConfig";
import { createAndRetain, initLocalBaseState } from "coral-framework/lib/relay";

import { AUTH_POPUP_ID, AUTH_POPUP_TYPE } from "./constants";

/**
 * Initializes the local state, before we start the App.
 */
export default async function initLocalState(
  environment: Environment,
  context: CoralContext
) {
  const config = await getExternalConfig(context.pym);
  await initLocalBaseState(
    environment,
    context,
    config ? config.accessToken : undefined
  );

  commitLocalUpdate(environment, s => {
    const root = s.getRoot();
    const localRecord = root.getLinkedRecord("local")!;

    // Parse query params
    const query = parseQuery(location.search);

    if (query.storyID) {
      localRecord.setValue(query.storyID, "storyID");
    }

    if (query.storyURL) {
      localRecord.setValue(query.storyURL, "storyURL");
    }

    if (query.commentID) {
      localRecord.setValue(query.commentID, "commentID");
    }
    // Set sort
    localRecord.setValue("CREATED_AT_DESC", "defaultStreamOrderBy");

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

    // Set active tabs
    localRecord.setValue("COMMENTS", "activeTab");
    localRecord.setValue("MY_COMMENTS", "profileTab");

    // Set sort
    localRecord.setValue("CREATED_AT_DESC", "defaultStreamOrderBy");
  });
}
