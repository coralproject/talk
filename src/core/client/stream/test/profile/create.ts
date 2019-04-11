import { CreateTestRendererParams } from "talk-framework/testHelpers";

import createTopLevel from "../create";

export default function create(params: CreateTestRendererParams) {
  return createTopLevel({
    ...params,
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue("PROFILE", "activeTab");
      localRecord.setValue("jti", "accessTokenJTI");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
}
