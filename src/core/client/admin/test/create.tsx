import React from "react";
import { Environment, RecordProxy, RecordSourceProxy } from "relay-runtime";

import App from "coral-admin/App";
import { DEFAULT_AUTO_ARCHIVE_OLDER_THAN } from "coral-common/constants";
import { GQLCOMMENT_SORT, GQLResolver } from "coral-framework/schema";
import {
  createTestContext,
  createTestRenderer,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";

const initLocalState = (
  localRecord: RecordProxy<{}>,
  source: RecordSourceProxy,
  environment: Environment,
  params: CreateTestRendererParams<GQLResolver>
) => {
  localRecord.setValue(GQLCOMMENT_SORT.CREATED_AT_DESC, "moderationQueueSort");

  localRecord.setValue(false, "forceAdminLocalAuth");

  localRecord.setValue(false, "archivingEnabled");
  localRecord.setValue(
    DEFAULT_AUTO_ARCHIVE_OLDER_THAN,
    "autoArchiveOlderThanMs"
  );

  if (params.initLocalState) {
    params.initLocalState(localRecord, source, environment);
  }
};

export default function create(params: CreateTestRendererParams<GQLResolver>) {
  return createTestRenderer<GQLResolver>("admin", <App />, {
    ...params,
    initLocalState: (localRecord, source, environment) => {
      initLocalState(localRecord, source, environment, params);
    },
  });
}

export function createContext(params: CreateTestRendererParams<GQLResolver>) {
  return createTestContext<GQLResolver>("admin", {
    ...params,
    initLocalState: (localRecord, source, environment) => {
      initLocalState(localRecord, source, environment, params);
    },
  });
}
