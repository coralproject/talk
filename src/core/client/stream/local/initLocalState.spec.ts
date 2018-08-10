import { Environment, RecordSource } from "relay-runtime";

import { timeout } from "talk-common/utils";
import { LOCAL_ID } from "talk-framework/lib/relay";
import { createInMemoryStorage } from "talk-framework/lib/storage";
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

it("init local state", async () => {
  initLocalState(environment, { localStorage: createInMemoryStorage() } as any);
  await timeout();
  expect(JSON.stringify(source.toJSON(), null, 2)).toMatchSnapshot();
});

it("set assetID from query", () => {
  const assetID = "asset-id";
  const previousLocation = location.toString();
  const previousState = window.history.state;
  window.history.replaceState(
    previousState,
    document.title,
    `http://localhost/?assetID=${assetID}`
  );
  initLocalState(environment, { localStorage: createInMemoryStorage() } as any);
  expect(source.get(LOCAL_ID)!.assetID).toBe(assetID);
  window.history.replaceState(previousState, document.title, previousLocation);
});

it("set commentID from query", () => {
  const commentID = "comment-id";
  const previousLocation = location.toString();
  const previousState = window.history.state;
  window.history.replaceState(
    previousState,
    document.title,
    `http://localhost/?commentID=${commentID}`
  );
  initLocalState(environment, { localStorage: createInMemoryStorage() } as any);
  expect(source.get(LOCAL_ID)!.commentID).toBe(commentID);
  window.history.replaceState(previousState, document.title, previousLocation);
});

it("set authToken from localStorage", () => {
  const authToken = "auth-token";
  const localStorage = createInMemoryStorage();
  localStorage.setItem("authToken", authToken);
  initLocalState(environment, { localStorage } as any);
  expect(source.get(LOCAL_ID)!.authToken).toBe(authToken);
  localStorage.removeItem("authToken");
});
