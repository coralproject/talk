import { IResolvers } from "graphql-tools";
import { Environment, RecordProxy, RecordSourceProxy } from "relay-runtime";
import { createRelayEnvironment } from "talk-framework/testHelpers";
import { AUTH_POPUP_ID, AUTH_POPUP_TYPE } from "talk-stream/local";

interface CreateEnvironmentParams {
  logNetwork?: boolean;
  resolvers: IResolvers<any, any>;
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
      resolvers: params.resolvers,
      projectName: "tenant",
    },
    initLocalState: (localRecord, source, environment) => {
      const authPopupRecord = source.create(AUTH_POPUP_ID, AUTH_POPUP_TYPE);
      authPopupRecord.setValue(false, "open");
      authPopupRecord.setValue(false, "focus");
      authPopupRecord.setValue("", "href");
      localRecord.setLinkedRecord(authPopupRecord, "authPopup");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
}
