import { Environment, RecordSource } from "relay-runtime";

import { ADMIN_REDIRECT_PATH_KEY } from "coral-admin/constants";
import { LOCAL_ID } from "coral-framework/lib/relay";
import {
  createInMemoryStorage,
  createPromisifiedStorage,
} from "coral-framework/lib/storage";
import { createRelayEnvironment } from "coral-framework/testHelpers";

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
  expect(storage.getItem(ADMIN_REDIRECT_PATH_KEY)).toEqual("/path");
});

it("Removes redirectPath", async () => {
  const storage = createInMemoryStorage();
  await SetRedirectPathMutation.commit(environment, { path: null }, {
    localStorage: createPromisifiedStorage(storage),
  } as any);
  expect(source.get(LOCAL_ID)!.redirectPath).toEqual(null);
  expect(storage.getItem(ADMIN_REDIRECT_PATH_KEY)).toEqual(null);
});
