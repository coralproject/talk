import { Environment, RecordSource } from "relay-runtime";

import { LOCAL_ID } from "talk-framework/lib/relay";
import { createRelayEnvironment } from "talk-framework/testHelpers";

import initLocalState from "./initLocalState";

let environment: Environment;
let source: RecordSource;

beforeEach(() => {
  source = new RecordSource();
  environment = createRelayEnvironment({
    source,
    initLocalState: false,
  });
});

it("init local state", () => {
  initLocalState(environment);
  expect(JSON.stringify(source.toJSON(), null, 2)).toMatchSnapshot();
});

it("set view from query", () => {
  const view = "SIGN_UP";
  const previousLocation = location.toString();
  const previousState = window.history.state;
  window.history.replaceState(
    previousState,
    document.title,
    `http://localhost/?view=${view}`
  );
  initLocalState(environment);
  expect(source.get(LOCAL_ID)!.view).toBe(view);
  window.history.replaceState(previousState, document.title, previousLocation);
});
