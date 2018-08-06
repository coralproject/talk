import React from "react";
import TestRenderer from "react-test-renderer";
import { RecordProxy } from "relay-runtime";
import sinon from "sinon";

import { timeout } from "talk-common/utils";
import { TalkContext, TalkContextProvider } from "talk-framework/lib/bootstrap";
import { createRelayEnvironment } from "talk-framework/testHelpers";
import AppContainer from "talk-stream/containers/AppContainer";

import { assetWithReplies } from "./fixtures";

const resolvers = {
  Query: {
    asset: sinon
      .stub()
      .throws()
      .withArgs(undefined, { id: assetWithReplies.id })
      .returns(assetWithReplies),
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
    localRecord.setValue(assetWithReplies.id, "assetID");
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

it("renders comment stream", async () => {
  // Wait for loading.
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});
