import { IResolvers } from "graphql-tools";
import { Environment, RecordProxy, RecordSourceProxy } from "relay-runtime";
import { createRelayEnvironment } from "talk-framework/testHelpers";

interface CreateEnvironmentParams {
  logNetwork?: boolean;
  resolvers?: IResolvers<any, any>;
  initLocalState?: (
    local: RecordProxy,
    source: RecordSourceProxy,
    environment: Environment
  ) => void;
}

export default function createEnvironment(params: CreateEnvironmentParams) {
  return createRelayEnvironment({
    network: {
      logNetwork: params.logNetwork,
      resolvers: params.resolvers || {},
      projectName: "tenant",
    },
    initLocalState: (localRecord, source, environment) => {
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
}
