import { Environment, RecordSource } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import { LOCAL_ID } from "coral-framework/lib/relay";
import { createRelayEnvironment } from "coral-framework/testHelpers";

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
  SetAuthViewMutation.commit(
    environment,
    { view },
    {} as unknown as CoralContext
  );
  expect(source.get(LOCAL_ID)!.authView).toEqual(view);
});
