import { commitLocalUpdate, Environment, RecordSource } from "relay-runtime";

import { timeout } from "talk-common/utils";
import { LOCAL_ID } from "talk-framework/lib/relay";
import { createInMemoryStorage } from "talk-framework/lib/storage";
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
  const context = {
    localStorage: createInMemoryStorage(),
  };
  const authToken = "auth token";
  commit(environment, { authToken }, context as any);
  expect(source.get(LOCAL_ID)!.authToken).toEqual(authToken);
  expect(context.localStorage.getItem("authToken")).toEqual(authToken);
});

it("Removes auth token from localStorage", async () => {
  const context = {
    localStorage: createInMemoryStorage(),
  };
  localStorage.setItem("authToken", "tmp");
  commit(environment, { authToken: null }, context as any);
  expect(context.localStorage.getItem("authToken")).toBeUndefined();
});

it("Should call gc", async () => {
  const context = {
    localStorage: createInMemoryStorage(),
  };
  commitLocalUpdate(environment, store => {
    store.create("should-disappear", "tmp");
  });
  const authToken = null;
  expect(source.get("should-disappear")).not.toBeUndefined();
  commit(environment, { authToken }, context as any);
  await timeout();
  expect(source.get(LOCAL_ID)!.authToken).toEqual(authToken);
  expect(source.get("should-disappear")).toBeUndefined();
});
