import React from "react";
import TestRenderer from "react-test-renderer";
import sinon from "sinon";

import { timeout } from "talk-common/utils";
import { TalkContext, TalkContextProvider } from "talk-framework/lib/bootstrap";
import AppContainer from "talk-stream/containers/AppContainer";

import createEnvironment from "./createEnvironment";
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

const environment = createEnvironment({
  // Set this to true, to see graphql responses.
  logNetwork: false,
  resolvers,
  initLocalState: (localRecord, source) => {
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
