import React from "react";

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
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
}
