import { Environment, RecordSource } from "relay-runtime";

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
  commit(environment, { tab });
  expect(source.get(LOCAL_ID)!.activeTab).toEqual(tab);
});
