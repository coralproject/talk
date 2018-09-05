import { Environment, RecordSource } from "relay-runtime";

import { timeout } from "talk-common/utils";
import { TalkContext } from "talk-framework/lib/bootstrap";
import { LOCAL_ID } from "talk-framework/lib/relay";
import {
  createInMemoryStorage,
  createPromisifiedStorage,
} from "talk-framework/lib/storage";
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
  const context: Partial<TalkContext> = {
    pymLocalStorage: createPromisifiedStorage(createInMemoryStorage()),
  };
  await initLocalState(environment, context as any);
  await timeout();
  expect(JSON.stringify(source.toJSON(), null, 2)).toMatchSnapshot();
});

it("set assetID from query", async () => {
  const context: Partial<TalkContext> = {
    pymLocalStorage: createPromisifiedStorage(createInMemoryStorage()),
  };
  const assetID = "asset-id";
  const previousLocation = location.toString();
  const previousState = window.history.state;
  window.history.replaceState(
    previousState,
    document.title,
    `http://localhost/?assetID=${assetID}`
  );
  await initLocalState(environment, context as any);
  expect(source.get(LOCAL_ID)!.assetID).toBe(assetID);
  window.history.replaceState(previousState, document.title, previousLocation);
});

it("set commentID from query", async () => {
  const context: Partial<TalkContext> = {
    pymLocalStorage: createPromisifiedStorage(createInMemoryStorage()),
  };
  const commentID = "comment-id";
  const previousLocation = location.toString();
  const previousState = window.history.state;
  window.history.replaceState(
    previousState,
    document.title,
    `http://localhost/?commentID=${commentID}`
  );
  await initLocalState(environment, context as any);
  expect(source.get(LOCAL_ID)!.commentID).toBe(commentID);
  window.history.replaceState(previousState, document.title, previousLocation);
});

it("set authToken from localStorage", async () => {
  const context: Partial<TalkContext> = {
    pymLocalStorage: createPromisifiedStorage(createInMemoryStorage()),
  };
  const authToken = "auth-token";
  context.pymLocalStorage!.setItem("authToken", authToken);
  await initLocalState(environment, context as any);
  expect(source.get(LOCAL_ID)!.authToken).toBe(authToken);
});
