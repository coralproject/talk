import { EventEmitter2 } from "eventemitter2";
import { Environment, RecordSource } from "relay-runtime";
import sinon from "sinon";

import { LOCAL_ID } from "coral-framework/lib/relay";
import { createRelayEnvironment } from "coral-framework/testHelpers";

import { commit } from "./SetActiveTabMutation";

let environment: Environment;
const source: RecordSource = new RecordSource();

beforeAll(() => {
  environment = createRelayEnvironment({
    source,
  });
});

it("Sets activeTab", () => {
  const tab = "COMMENTS";
  const eventEmitter = new EventEmitter2();
  const mock = sinon.mock(eventEmitter);
  mock.expects("emit").withArgs("setMainTab", { tab });
  commit(environment, { tab }, { eventEmitter });
  expect(source.get(LOCAL_ID)!.activeTab).toEqual(tab);
  mock.verify();
});
