import { commitLocalUpdate, Environment } from "relay-runtime";

import { parseQuery } from "coral-common/utils";
import { CoralContext } from "coral-framework/lib/bootstrap";
import { getExternalConfig } from "coral-framework/lib/externalConfig";
import { createAndRetain, initLocalBaseState } from "coral-framework/lib/relay";

import { COMMENTS_ORDER_BY } from "../constants";
import { AUTH_POPUP_ID, AUTH_POPUP_TYPE } from "./constants";

/**
 * Initializes the local state, before we start the App.
 */
export default async function initLocalState(
  environment: Environment,
  context: CoralContext
) {
  const config = await getExternalConfig(context.pym);
  if (config && config.accessToken) {
    context.auth.set(config.accessToken);
  }

  initLocalBaseState(environment, context);

  const commentsOrderBy =
    (await context.localStorage.getItem(COMMENTS_ORDER_BY)) ||
    "CREATED_AT_DESC";

  commitLocalUpdate(environment, (s) => {
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
    localRecord.setValue(commentsOrderBy, "commentsOrderBy");

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

    // Initialize the comments tab to NONE for now, it will be initialized to an
    // actual tab when we find out how many feature comments there are.
    localRecord.setValue("NONE", "commentsTab");
  });
}
