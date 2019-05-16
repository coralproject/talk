import { Environment, RecordSource } from "relay-runtime";
import sinon from "sinon";

import { CoralContext } from "coral-framework/lib/bootstrap";
import { LOCAL_ID } from "coral-framework/lib/relay";
import { createPromisifiedStorage } from "coral-framework/lib/storage";
import {
  createAccessToken,
  createRelayEnvironment,
} from "coral-framework/testHelpers";

import SetAccessTokenMutation from "./SetAccessTokenMutation";

let environment: Environment;
const source: RecordSource = new RecordSource();

beforeAll(() => {
  environment = createRelayEnvironment({
    source,
  });
});

const accessToken = createAccessToken();

it("Sets auth token to localStorage", async () => {
  const clearSessionStub = sinon.stub();
  const context: Partial<CoralContext> = {
    localStorage: createPromisifiedStorage(),
    clearSession: clearSessionStub,
  };
  await SetAccessTokenMutation.commit(
    environment,
    { accessToken },
    context as any
  );
  expect(source.get(LOCAL_ID)!.accessToken).toEqual(accessToken);
  await expect(context.localStorage!.getItem("accessToken")).resolves.toEqual(
    accessToken
  );
  expect(clearSessionStub.calledOnce).toBe(true);
});

it("Removes auth token from localStorage", async () => {
  const clearSessionStub = sinon.stub();
  const context: Partial<CoralContext> = {
    localStorage: createPromisifiedStorage(),
    clearSession: clearSessionStub,
  };
  localStorage.setItem("accessToken", accessToken);
  await SetAccessTokenMutation.commit(
    environment,
    { accessToken: null },
    context as any
  );
  await expect(
    context.localStorage!.getItem("accessToken")
  ).resolves.toBeNull();
  expect(clearSessionStub.calledOnce).toBe(true);
});
