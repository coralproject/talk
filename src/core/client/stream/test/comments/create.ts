import { CreateTestRendererParams } from "talk-framework/testHelpers";

import createTopLevel from "../create";

export default function create(params: CreateTestRendererParams) {
  return createTopLevel({
    ...params,
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue("COMMENTS", "activeTab");
      localRecord.setValue(false, "loggedIn");
      localRecord.setValue("jti", "accessTokenJTI");
      localRecord.setValue("CREATED_AT_DESC", "defaultStreamOrderBy");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
}
