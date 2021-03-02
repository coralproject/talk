import { Environment, RecordSource } from "relay-runtime";

import { waitFor } from "coral-common/helpers";
import { CoralContext } from "coral-framework/lib/bootstrap";
import { LOCAL_ID } from "coral-framework/lib/relay";
import { createPromisifiedStorage } from "coral-framework/lib/storage";
import {
  createRelayEnvironment,
  replaceHistoryLocation,
} from "coral-framework/testHelpers";

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
  const context: Partial<CoralContext> = {
    localStorage: createPromisifiedStorage(),
    window,
    renderWindow: window,
  };
  await initLocalState({ environment, context: context as any });
  await waitFor();
  expect(JSON.stringify(source.toJSON(), null, 2)).toMatchSnapshot();
});

it("set storyID from query", async () => {
  const context: Partial<CoralContext> = {
    localStorage: createPromisifiedStorage(),
  };
  const storyID = "story-id";
  const restoreHistoryLocation = replaceHistoryLocation(
    `http://localhost/?storyID=${storyID}`
  );
  await initLocalState({ environment, context: context as any });
  expect(source.get(LOCAL_ID)!.storyID).toBe(storyID);
  restoreHistoryLocation();
});

it("set commentID from query", async () => {
  const context: Partial<CoralContext> = {
    localStorage: createPromisifiedStorage(),
    window,
    renderWindow: window,
  };
  const commentID = "comment-id";
  const restoreHistoryLocation = replaceHistoryLocation(
    `http://localhost/?commentID=${commentID}`
  );
  await initLocalState({ environment, context: context as any });
  expect(source.get(LOCAL_ID)!.commentID).toBe(commentID);
  restoreHistoryLocation();
});
