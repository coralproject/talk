import React from "react";
import TestRenderer from "react-test-renderer";
import { RecordProxy } from "relay-runtime";

import { timeout } from "talk-common/utils";
import { TalkContext, TalkContextProvider } from "talk-framework/lib/bootstrap";
import { createRelayEnvironment } from "talk-framework/testHelpers";
import AppContainer from "talk-stream/containers/AppContainer";

const resolvers = {
  Query: {
    comment: () => null,
    asset: () => null,
  },
};

const environment = createRelayEnvironment({
  network: {
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    projectName: "tenant",
  },
  initLocalState: (localRecord: RecordProxy) => {
    localRecord.setValue("unknown-asset-id", "assetID");
    localRecord.setValue("unknown-comment-id", "commentID");
  },
});

const context: TalkContext = {
  relayEnvironment: environment,
  localeMessages: [],
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
