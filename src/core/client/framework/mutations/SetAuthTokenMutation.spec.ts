import { Environment, RecordSource } from "relay-runtime";

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

it("Sets auth token to localStorage", () => {
  const context = {
    localStorage: createInMemoryStorage(),
  };
  const authToken = "auth token";
  commit(environment, { authToken }, context as any);
  expect(source.get(LOCAL_ID)!.authToken).toEqual(authToken);
  expect(context.localStorage.getItem("authToken")).toEqual(authToken);
});

it("Removes auth token from localStorage", () => {
  const context = {
    localStorage: createInMemoryStorage(),
  };
  localStorage.setItem("authToken", "tmp");
  commit(environment, { authToken: null }, context as any);
  expect(context.localStorage.getItem("authToken")).toBeNull();
});
