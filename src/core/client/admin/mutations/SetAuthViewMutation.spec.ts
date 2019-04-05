import { Environment, RecordSource } from "relay-runtime";

import { LOCAL_ID } from "talk-framework/lib/relay";
import { createRelayEnvironment } from "talk-framework/testHelpers";

import SetAuthViewMutation from "./SetAuthViewMutation";

let environment: Environment;
const source: RecordSource = new RecordSource();

beforeAll(() => {
  environment = createRelayEnvironment({
    source,
  });
});

it("Sets view", () => {
  const view = "SIGN_IN";
  SetAuthViewMutation.commit(environment, { view }, {} as any);
  expect(source.get(LOCAL_ID)!.authView).toEqual(view);
});
