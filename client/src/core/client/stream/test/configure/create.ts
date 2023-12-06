import { GQLResolver } from "coral-framework/schema";
import { CreateTestRendererParams } from "coral-framework/testHelpers";
import { Environment, RecordProxy, RecordSourceProxy } from "relay-runtime";

import createTopLevel, {
  createContext as createTopLevelContext,
} from "../create";

const initLocalState = (
  localRecord: RecordProxy<{}>,
  source: RecordSourceProxy,
  environment: Environment,
  params: CreateTestRendererParams<GQLResolver>
) => {
  localRecord.setValue("CONFIGURE", "activeTab");
  localRecord.setValue("jti", "accessTokenJTI");
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
