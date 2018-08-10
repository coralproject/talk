import { commitLocalUpdate, Environment, RecordSource } from "relay-runtime";

import { timeout } from "talk-common/utils";
import { LOCAL_ID } from "talk-framework/lib/relay";
import { createRelayEnvironment } from "talk-framework/testHelpers";

import { commit } from "./SetAuthTokenMutation";

let environment: Environment;
const source: RecordSource = new RecordSource();

beforeAll(() => {
  environment = createRelayEnvironment({
    source,
  });
});

it("Sets auth token", async () => {
  const authToken = "auth token";
  commit(environment, { authToken });
  expect(source.get(LOCAL_ID)!.authToken).toEqual(authToken);
});

it("Should call gc", async () => {
  commitLocalUpdate(environment, store => {
    store.create("should-disappear", "tmp");
  });
  const authToken = null;
  expect(source.get("should-disappear")).not.toBeUndefined();
  commit(environment, { authToken });
  await timeout();
  expect(source.get(LOCAL_ID)!.authToken).toEqual(authToken);
  expect(source.get("should-disappear")).toBeUndefined();
});
