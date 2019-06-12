import { CreateTestRendererParams } from "coral-framework/testHelpers";

import superCreate from "../create";

export default function create(params: CreateTestRendererParams) {
  return superCreate({
    ...params,
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue("FEATURED_COMMENTS", "commentsTab");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
}
