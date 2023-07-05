import { Environment, RecordProxy, RecordSourceProxy } from "relay-runtime";

import { GQLResolver } from "coral-framework/schema";
import { CreateTestRendererParams } from "coral-framework/testHelpers";

import createTopLevel, {
  createContext as createContextTopLevel,
} from "../create";

const initLocalState = (
  localRecord: RecordProxy<{}>,
  source: RecordSourceProxy,
  environment: Environment,
  params: CreateTestRendererParams<GQLResolver>
) => {
  localRecord.setValue("ALL_COMMENTS", "commentsTab");
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

export function createContext(params: CreateTestRendererParams) {
  return createContextTopLevel({
    ...params,
    initLocalState: (localRecord, source, environment) => {
      initLocalState(localRecord, source, environment, params);
    },
  });
}
