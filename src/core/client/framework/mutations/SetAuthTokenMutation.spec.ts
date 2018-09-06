import { Environment, RecordSource } from "relay-runtime";
import sinon from "sinon";

import { TalkContext } from "talk-framework/lib/bootstrap";
import { LOCAL_ID } from "talk-framework/lib/relay";
import { createPromisifiedStorage } from "talk-framework/lib/storage";
import { createRelayEnvironment } from "talk-framework/testHelpers";

import { commit } from "./SetAuthTokenMutation";

let environment: Environment;
const source: RecordSource = new RecordSource();

beforeAll(() => {
  environment = createRelayEnvironment({
    source,
  });
});

it("Sets auth token to localStorage", async () => {
  const clearSessionStub = sinon.stub();
  const context: Partial<TalkContext> = {
    localStorage: createPromisifiedStorage(),
    clearSession: clearSessionStub,
  };
  const authToken = "auth token";
  await commit(environment, { authToken }, context as any);
  expect(source.get(LOCAL_ID)!.authToken).toEqual(authToken);
  await expect(context.localStorage!.getItem("authToken")).resolves.toEqual(
    authToken
  );
  expect(clearSessionStub.calledOnce).toBe(true);
});

it("Removes auth token from localStorage", async () => {
  const clearSessionStub = sinon.stub();
  const context: Partial<TalkContext> = {
    localStorage: createPromisifiedStorage(),
    clearSession: clearSessionStub,
  };
  localStorage.setItem("authToken", "tmp");
  await commit(environment, { authToken: null }, context as any);
  await expect(context.localStorage!.getItem("authToken")).resolves.toBeNull();
  expect(clearSessionStub.calledOnce).toBe(true);
});
