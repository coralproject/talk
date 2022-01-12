import React from "react";

import App from "coral-admin/App";
import { DEFAULT_AUTO_ARCHIVE_OLDER_THAN } from "coral-common/constants";
import { GQLCOMMENT_SORT, GQLResolver } from "coral-framework/schema";
import {
  createTestRenderer,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";

export default function create(params: CreateTestRendererParams<GQLResolver>) {
  return createTestRenderer<GQLResolver>("admin", <App />, {
    ...params,
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue(
        GQLCOMMENT_SORT.CREATED_AT_DESC,
        "moderationQueueSort"
      );

      localRecord.setValue(false, "forceAdminLocalAuth");

      localRecord.setValue(false, "archivingEnabled");
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
