import React from "react";

import { DEFAULT_AUTO_ARCHIVE_OLDER_THAN } from "coral-common/constants";
import { createAndRetain } from "coral-framework/lib/relay";
import {
  createTestRenderer,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";
import AppContainer from "coral-stream/App";
import { AUTH_POPUP_ID, AUTH_POPUP_TYPE } from "coral-stream/local";

export default function create(params: CreateTestRendererParams) {
  return createTestRenderer("stream", <AppContainer disableListeners />, {
    ...params,
    initLocalState: (localRecord, source, environment) => {
      const authPopupRecord = createAndRetain(
        environment,
        source,
        AUTH_POPUP_ID,
        AUTH_POPUP_TYPE
      );
      authPopupRecord.setValue(false, "open");
      authPopupRecord.setValue(false, "focus");
      authPopupRecord.setValue("", "href");
      localRecord.setLinkedRecord(authPopupRecord, "authPopup");
      localRecord.setValue(false, "flattenReplies");
      localRecord.setValue(false, "enableCommentSeen");
      localRecord.setValue(false, "enableZKey");
      localRecord.setValue(false, "amp");
      localRecord.setValue(true, "archivingEnabled");
      localRecord.setValue(
        DEFAULT_AUTO_ARCHIVE_OLDER_THAN,
        "autoArchiveOlderThanMs"
      );
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
}
