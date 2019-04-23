import { Environment, RecordSource } from "relay-runtime";

import { REDIRECT_PATH_KEY } from "talk-admin/constants";
import { LOCAL_ID } from "talk-framework/lib/relay";
import { createRelayEnvironment } from "talk-framework/testHelpers";

import {
  createInMemoryStorage,
  createPromisifiedStorage,
} from "talk-framework/lib/storage";
import SetRedirectPathMutation from "./SetRedirectPathMutation";

let environment: Environment;
const source: RecordSource = new RecordSource();

beforeAll(() => {
  environment = createRelayEnvironment({
    source,
  });
});

it("Sets redirectPath", async () => {
  const storage = createInMemoryStorage();
  await SetRedirectPathMutation.commit(environment, { path: "/path" }, {
    localStorage: createPromisifiedStorage(storage),
  } as any);
  expect(source.get(LOCAL_ID)!.redirectPath).toEqual("/path");
  expect(storage.getItem(REDIRECT_PATH_KEY)).toEqual("/path");
});

it("Removes redirectPath", async () => {
  const storage = createInMemoryStorage();
  await SetRedirectPathMutation.commit(environment, { path: null }, {
    localStorage: createPromisifiedStorage(storage),
  } as any);
  expect(source.get(LOCAL_ID)!.redirectPath).toEqual(null);
  expect(storage.getItem(REDIRECT_PATH_KEY)).toEqual(null);
});
