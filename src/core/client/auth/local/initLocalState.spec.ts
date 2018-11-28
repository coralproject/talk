import { Environment, RecordSource } from "relay-runtime";

import { LOCAL_ID } from "talk-framework/lib/relay";
import {
  createRelayEnvironment,
  replaceHistoryLocation,
} from "talk-framework/testHelpers";

import initLocalState from "./initLocalState";

let environment: Environment;
let source: RecordSource;

const context = {
  localStorage: window.localStorage,
};

beforeEach(() => {
  source = new RecordSource();
  environment = createRelayEnvironment({
    source,
    initLocalState: false,
  });
});

it("init local state", async () => {
  await initLocalState(environment, context as any);
  expect(JSON.stringify(source.toJSON(), null, 2)).toMatchSnapshot();
});

it("set view from query", async () => {
  const view = "SIGN_UP";
  const restoreHistoryLocation = replaceHistoryLocation(
    `http://localhost/?view=${view}`
  );
  await initLocalState(environment, context as any);
  expect(source.get(LOCAL_ID)!.view).toBe(view);
  restoreHistoryLocation();
});
