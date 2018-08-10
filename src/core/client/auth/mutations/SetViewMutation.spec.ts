import { Environment, RecordSource } from "relay-runtime";

import { LOCAL_ID } from "talk-framework/lib/relay";
import { createRelayEnvironment } from "talk-framework/testHelpers";

import { commit } from "./SetViewMutation";

let environment: Environment;
const source: RecordSource = new RecordSource();

beforeAll(() => {
  environment = createRelayEnvironment({
    source,
  });
});

it("Sets view", () => {
  const view = "SIGN_UP";
  commit(environment, { view }, {} as any);
  expect(source.get(LOCAL_ID)!.view).toEqual(view);
});
