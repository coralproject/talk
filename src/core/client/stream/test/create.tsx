import React from "react";

import {
  createTestRenderer,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";
import AppContainer from "coral-stream/containers/AppContainer";
import { AUTH_POPUP_ID, AUTH_POPUP_TYPE } from "coral-stream/local";

export default function create(params: CreateTestRendererParams) {
  return createTestRenderer("stream", <AppContainer />, {
    ...params,
    initLocalState: (localRecord, source, environment) => {
      const authPopupRecord = source.create(AUTH_POPUP_ID, AUTH_POPUP_TYPE);
      authPopupRecord.setValue(false, "open");
      authPopupRecord.setValue(false, "focus");
      authPopupRecord.setValue("", "href");
      localRecord.setLinkedRecord(authPopupRecord, "authPopup");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
}
