import { Environment, RecordSource } from "relay-runtime";

import { LOCAL_ID } from "coral-framework/lib/relay";
import {
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
it("set view from query", async () => {
  const view = "SIGN_UP";
  const restoreHistoryLocation = replaceHistoryLocation(
    `http://localhost/?view=${view}`
  );
  await initLocalState({ environment, context: context as any });
  expect(source.get(LOCAL_ID)!.view).toBe(view);
  restoreHistoryLocation();
});

it("get error from url", async () => {
  const restoreHistoryLocation = replaceHistoryLocation(
    `http://localhost/#error=error`
  );
  await initLocalState({ environment, context: context as any });
  expect(source.get(LOCAL_ID)!.error).toBe("error");
  restoreHistoryLocation();
});
