import React from "react";
import TestRenderer from "react-test-renderer";
import { RecordProxy } from "relay-runtime";
import sinon from "sinon";

import { timeout } from "talk-common/utils";
import { TalkContext, TalkContextProvider } from "talk-framework/lib/bootstrap";
import { createRelayEnvironment } from "talk-framework/testHelpers";
import AppContainer from "talk-stream/containers/AppContainer";

import { assets, comments } from "./fixtures";

const commentStub = {
  ...comments[0],
};

const assetStub = {
  ...assets[0],
  comments: {
    pageInfo: {
      hasNextPage: false,
    },
    edges: [
      {
        node: commentStub,
        cursor: commentStub.createdAt,
      },
    ],
  },
};

const resolvers = {
  Query: {
    comment: sinon
      .stub()
      .throws()
      .withArgs(undefined, { id: commentStub.id })
      .returns(commentStub),
    asset: sinon
      .stub()
      .throws()
      .withArgs(undefined, { id: assetStub.id })
      .returns(assetStub),
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
    localRecord.setValue(assetStub.id, "assetID");
    localRecord.setValue(commentStub.id, "commentID");
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

it("renders permalink view", async () => {
  // Wait for loading.
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("show all comments", async () => {
  const mockEvent = {
    preventDefault: sinon.mock().once(),
  };
  testRenderer.root
    .findByProps({
      id: "talk-comments-permalinkView-showAllComments",
    })
    .props.onClick(mockEvent);
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot();
  mockEvent.preventDefault.verify();
});
