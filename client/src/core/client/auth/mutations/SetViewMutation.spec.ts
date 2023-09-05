import { Environment, RecordSource } from "relay-runtime";

import { LOCAL_ID } from "coral-framework/lib/relay";
import { createRelayEnvironment } from "coral-framework/testHelpers";

import SetViewMutation from "./SetViewMutation";

let environment: Environment;
const source: RecordSource = new RecordSource();

beforeAll(() => {
  environment = createRelayEnvironment({
    source,
  });
});

it("Sets view", () => {
  const view = "SIGN_UP";
  SetViewMutation.commit(environment, { view }, {} as any);
  expect(source.get(LOCAL_ID)!.view).toEqual(view);
});
