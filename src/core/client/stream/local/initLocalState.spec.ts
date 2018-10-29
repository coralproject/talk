import { Environment, RecordSource } from "relay-runtime";

import { timeout } from "talk-common/utils";
import { TalkContext } from "talk-framework/lib/bootstrap";
import { LOCAL_ID } from "talk-framework/lib/relay";
import { createPromisifiedStorage } from "talk-framework/lib/storage";
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
    localStorage: createPromisifiedStorage(),
  };
  await initLocalState(environment, context as any);
  await timeout();
  expect(JSON.stringify(source.toJSON(), null, 2)).toMatchSnapshot();
});

it("set storyID from query", async () => {
  const context: Partial<TalkContext> = {
    localStorage: createPromisifiedStorage(),
  };
  const storyID = "story-id";
  const previousLocation = location.toString();
  const previousState = window.history.state;
  window.history.replaceState(
    previousState,
    document.title,
    `http://localhost/?storyID=${storyID}`
  );
  await initLocalState(environment, context as any);
  expect(source.get(LOCAL_ID)!.storyID).toBe(storyID);
  window.history.replaceState(previousState, document.title, previousLocation);
});

it("set commentID from query", async () => {
  const context: Partial<TalkContext> = {
    localStorage: createPromisifiedStorage(),
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
    localStorage: createPromisifiedStorage(),
  };
  const authToken = "auth-token";
  context.localStorage!.setItem("authToken", authToken);
  await initLocalState(environment, context as any);
  expect(source.get(LOCAL_ID)!.authToken).toBe(authToken);
});
