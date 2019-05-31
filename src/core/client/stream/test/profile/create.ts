import { CreateTestRendererParams } from "coral-framework/testHelpers";

import createTopLevel from "../create";
import { stories } from "../fixtures";

const story = stories[0];

export default function create(params: CreateTestRendererParams) {
  return createTopLevel({
    ...params,
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue("PROFILE", "activeTab");
      localRecord.setValue("jti", "accessTokenJTI");
      localRecord.setValue(true, "loggedIn");
      localRecord.setValue(story.id, "storyID");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
}
