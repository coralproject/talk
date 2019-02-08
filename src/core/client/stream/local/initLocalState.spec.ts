import { Environment, RecordSource } from "relay-runtime";

import { timeout } from "talk-common/utils";
import { TalkContext } from "talk-framework/lib/bootstrap";
import { LOCAL_ID } from "talk-framework/lib/relay";
import { createPromisifiedStorage } from "talk-framework/lib/storage";
import {
  createAccessToken,
  createRelayEnvironment,
  replaceHistoryLocation,
} from "talk-framework/testHelpers";

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
  const restoreHistoryLocation = replaceHistoryLocation(
    `http://localhost/?storyID=${storyID}`
  );
  await initLocalState(environment, context as any);
  expect(source.get(LOCAL_ID)!.storyID).toBe(storyID);
  restoreHistoryLocation();
});

it("set commentID from query", async () => {
  const context: Partial<TalkContext> = {
    localStorage: createPromisifiedStorage(),
  };
  const commentID = "comment-id";
  const restoreHistoryLocation = replaceHistoryLocation(
    `http://localhost/?commentID=${commentID}`
  );
  await initLocalState(environment, context as any);
  expect(source.get(LOCAL_ID)!.commentID).toBe(commentID);
  restoreHistoryLocation();
});

it("set accessToken from localStorage", async () => {
  const context: Partial<TalkContext> = {
    localStorage: createPromisifiedStorage(),
  };
  const accessToken = createAccessToken();
  context.localStorage!.setItem("accessToken", accessToken);
  await initLocalState(environment, context as any);
  expect(source.get(LOCAL_ID)!.accessToken).toBe(accessToken);
});
