import React from "react";
import TestRenderer from "react-test-renderer";
import { RecordProxy } from "relay-runtime";
import sinon from "sinon";

import { timeout } from "talk-common/utils";
import { TalkContext, TalkContextProvider } from "talk-framework/lib/bootstrap";
import { createRelayEnvironment } from "talk-framework/testHelpers";
import AppContainer from "talk-stream/containers/AppContainer";

import { assets, comments } from "./fixtures";

const connectionStub = sinon.stub().throws();
connectionStub.withArgs({ first: 5, orderBy: "CREATED_AT_DESC" }).returns({
  edges: [
    {
      node: comments[0],
      cursor: comments[0].createdAt,
    },
    {
      node: comments[1],
      cursor: comments[1].createdAt,
    },
  ],
  pageInfo: {
    endCursor: comments[1].createdAt,
    hasNextPage: true,
  },
});
connectionStub
  .withArgs({
    first: 10,
    orderBy: "CREATED_AT_DESC",
    after: comments[1].createdAt,
  })
  .returns({
    edges: [
      {
        node: comments[2],
        cursor: comments[2].createdAt,
      },
    ],
    pageInfo: {
      endCursor: comments[2].createdAt,
      hasNextPage: false,
    },
  });

const assetStub = {
  ...assets[0],
  comments: connectionStub,
};

const resolvers = {
  Query: {
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

it("loads more comments", async () => {
  testRenderer.root
    .findByProps({ id: "talk-comments-stream-loadMore" })
    .props.onClick();

  // Wait for loading.
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});
