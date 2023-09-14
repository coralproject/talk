import { GQLResolver } from "coral-framework/schema";
import { CreateTestRendererParams } from "coral-framework/testHelpers";
import { Environment, RecordProxy, RecordSourceProxy } from "relay-runtime";

import createTopLevel, { createContext } from "../create";
import { stories } from "../fixtures";

const story = stories[0];

const initLocalState = (
  localRecord: RecordProxy<{}>,
  source: RecordSourceProxy,
  environment: Environment,
  params: CreateTestRendererParams<GQLResolver>
) => {
  localRecord.setValue("PROFILE", "activeTab");
  localRecord.setValue("jti", "accessTokenJTI");
  localRecord.setValue(story.id, "storyID");
  if (params.initLocalState) {
    params.initLocalState(localRecord, source, environment);
  }
};

export default function create(params: CreateTestRendererParams) {
  return createTopLevel({
    ...params,
    initLocalState: (localRecord, source, environment) => {
      initLocalState(localRecord, source, environment, params);
    },
  });
}

export function createWithContext(params: CreateTestRendererParams) {
  return createContext({
    ...params,
    initLocalState: (localRecord, source, environment) => {
      initLocalState(localRecord, source, environment, params);
    },
  });
}
