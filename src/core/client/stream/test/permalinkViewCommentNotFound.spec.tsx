import React from "react";
import TestRenderer from "react-test-renderer";
import { RecordProxy } from "relay-runtime";
import sinon from "sinon";

import { timeout } from "talk-common/utils";
import { TalkContext, TalkContextProvider } from "talk-framework/lib/bootstrap";
import AppContainer from "talk-stream/containers/AppContainer";

import createEnvironment from "./createEnvironment";
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
    comment: () => null,
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
  initLocalState: (localRecord: RecordProxy) => {
    localRecord.setValue(assetStub.id, "assetID");
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

it("renders permalink view with unknown comment", async () => {
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
