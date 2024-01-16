import { Environment, RecordProxy, RecordSourceProxy } from "relay-runtime";

import { GQLResolver } from "coral-framework/schema";
import { CreateTestRendererParams } from "coral-framework/testHelpers";

import createTopLevel, {
  createContext as createTopLevelContext,
} from "../create";

const initLocalState = (
  localRecord: RecordProxy<{}>,
  source: RecordSourceProxy,
  environment: Environment,
  params: CreateTestRendererParams<GQLResolver>
) => {
  localRecord.setValue("COMMENTS", "activeTab");
  localRecord.setValue("ALL_COMMENTS", "commentsTab");
  localRecord.setValue("jti", "accessTokenJTI");
  localRecord.setValue("CREATED_AT_DESC", "commentsOrderBy");
  localRecord.setValue(false, "refreshStream");
  if (params.initLocalState) {
    params.initLocalState(localRecord, source, environment);
  }
};

export default function create(params: CreateTestRendererParams<GQLResolver>) {
  return createTopLevel({
    ...params,
    initLocalState: (localRecord, source, environment) => {
      initLocalState(localRecord, source, environment, params);
    },
  });
}

export function createContext(params: CreateTestRendererParams<GQLResolver>) {
  return createTopLevelContext({
    ...params,
    initLocalState: (localRecord, source, environment) => {
      initLocalState(localRecord, source, environment, params);
    },
  });
}
