import { CreateTestRendererParams } from "coral-framework/testHelpers";

import createTopLevel from "../create";

export default function create(params: CreateTestRendererParams) {
  return createTopLevel({
    ...params,
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue("COMMENTS", "activeTab");
      localRecord.setValue("ALL_COMMENTS", "commentsTab");
      localRecord.setValue("jti", "accessTokenJTI");
      localRecord.setValue("CREATED_AT_DESC", "commentsOrderBy");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
}
