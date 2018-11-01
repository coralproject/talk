import { Environment, RecordSource } from "relay-runtime";

import { createRelayEnvironment } from "talk-framework/testHelpers";

import { NETWORK_ID, NETWORK_TYPE } from "../lib/relay/localState";
import { commit } from "./SetNetworkStatusMutation";

let environment: Environment;
const source: RecordSource = new RecordSource();

beforeAll(() => {
  environment = createRelayEnvironment({
    source,
    initLocalState: (localRecord, sourceProxy) => {
      const networkRecord = sourceProxy.create(NETWORK_ID, NETWORK_TYPE);
      networkRecord.setValue(false, "isOffline");
      localRecord.setLinkedRecord(networkRecord, "network");
    },
  });
});

it("Sets comment id", () => {
  commit(environment, { isOffline: true });
  expect(source.get(NETWORK_ID)!.isOffline).toEqual(true);
});
