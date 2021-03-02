import { Environment, RecordSource } from "relay-runtime";

import { LOCAL_ID } from "coral-framework/lib/relay";
import {
  createAccessToken,
  createRelayEnvironment,
  replaceHistoryLocation,
} from "coral-framework/testHelpers";

import initLocalState from "./initLocalState";

let environment: Environment;
let source: RecordSource;

const context = {
  localStorage: window.localStorage,
  sessionStorage: window.sessionStorage,
  window,
  renderWindow: window,
};

beforeEach(() => {
  source = new RecordSource();
  environment = createRelayEnvironment({
    source,
    initLocalState: false,
  });
});

it("init local state", async () => {
  await initLocalState({ environment, context: context as any });
  expect(JSON.stringify(source.toJSON(), null, 2)).toMatchSnapshot();
});

it("get access token from url", async () => {
  const restoreHistoryLocation = replaceHistoryLocation(
    `http://localhost/#accessToken=${createAccessToken()}`
  );
  await initLocalState({ environment, context: context as any });
  expect(JSON.stringify(source.get(LOCAL_ID), null, 2)).toMatchSnapshot();
  restoreHistoryLocation();
});

it("get error from url", async () => {
  const restoreHistoryLocation = replaceHistoryLocation(
    `http://localhost/#error=error`
  );
  await initLocalState({ environment, context: context as any });
  expect(source.get(LOCAL_ID)!.authError).toBe("error");
  restoreHistoryLocation();
});
