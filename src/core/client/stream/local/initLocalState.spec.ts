import { Environment, RecordSource } from "relay-runtime";

import { waitFor } from "coral-common/helpers";
import { CoralContext } from "coral-framework/lib/bootstrap";
import { createPromisifiedStorage } from "coral-framework/lib/storage";
import {
  createAccessToken,
  createRelayEnvironment,
} from "coral-framework/testHelpers";

import { createInitLocalState } from "./initLocalState";

let environment: Environment;
let source: RecordSource;

const initLocalState = createInitLocalState({
  storyID: "storyID",
  storyURL: "storyURL",
  storyMode: "storyMode",
  commentID: "commentID",
  customCSSURL: "customCSSURL",
  accessToken: createAccessToken(),
  version: "version",
  amp: true,
});

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
