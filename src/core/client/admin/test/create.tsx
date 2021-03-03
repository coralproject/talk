import React from "react";

import App from "coral-admin/App";
import {
  createTestRenderer,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";
import {
  GQLCOMMENT_SORT,
  GQLResolver,
} from "coral-framework/testHelpers/schema";

export default function create(params: CreateTestRendererParams<GQLResolver>) {
  return createTestRenderer<GQLResolver>("admin", <App />, {
    ...params,
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue(
        GQLCOMMENT_SORT.CREATED_AT_DESC,
        "moderationQueueSort"
      );

      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
}
