import React from "react";
import TestRenderer from "react-test-renderer";
import { RecordProxy } from "relay-runtime";

import { timeout } from "talk-common/utils";
import { TalkContext, TalkContextProvider } from "talk-framework/lib/bootstrap";
import { PostMessageService } from "talk-framework/lib/postMessage";
import { RestClient } from "talk-framework/lib/rest";
import { createInMemoryStorage } from "talk-framework/lib/storage";
import AppContainer from "talk-stream/containers/AppContainer";

import createEnvironment from "./createEnvironment";

const resolvers = {
  Query: {
    comment: () => null,
    asset: () => null,
  },
};

const environment = createEnvironment({
  // Set this to true, to see graphql responses.
  logNetwork: false,
  resolvers,
  initLocalState: (localRecord: RecordProxy) => {
    localRecord.setValue(0, "authRevision");
    localRecord.setValue("unknown-asset-id", "assetID");
    localRecord.setValue("unknown-comment-id", "commentID");
  },
});

const context: TalkContext = {
  relayEnvironment: environment,
  localeBundles: [],
  localStorage: createInMemoryStorage(),
  sessionStorage: createInMemoryStorage(),
  rest: new RestClient("http://localhost/api"),
  postMessage: new PostMessageService(),
};

const testRenderer = TestRenderer.create(
  <TalkContextProvider value={context}>
    <AppContainer />
  </TalkContextProvider>
);

it("renders permalink view with unknown asset", async () => {
  // Wait for loading.
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});
