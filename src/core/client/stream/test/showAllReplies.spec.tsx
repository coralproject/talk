import React from "react";
import TestRenderer from "react-test-renderer";
import { RecordProxy } from "relay-runtime";
import sinon from "sinon";

import { timeout } from "talk-common/utils";
import { TalkContext, TalkContextProvider } from "talk-framework/lib/bootstrap";
import AppQuery from "talk-stream/queries/AppQuery";

import createEnvironment from "./createEnvironment";
import { assets, comments } from "./fixtures";

const commentStub = {
  ...comments[0],
  replies: {
    edges: sinon
      .stub()
      .onFirstCall()
      .returns([
        {
          node: comments[1],
          cursor: comments[1].createdAt,
        },
      ])
      .onSecondCall()
      .returns([
        {
          node: comments[2],
          cursor: comments[2].createdAt,
        },
      ]),
    pageInfo: sinon
      .stub()
      .onFirstCall()
      .returns({
        endCursor: comments[1].createdAt,
        hasNextPage: true,
      })
      .onSecondCall()
      .returns({
        endCursor: comments[2].createdAt,
        hasNextPage: false,
      }),
  },
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
    comment: () => commentStub,
    asset: () => assetStub,
  },
};

const environment = createEnvironment({
  // Set this to true, to see graphql responses.
  logNetwork: false,
  resolvers,
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
    <AppQuery />
  </TalkContextProvider>
);

it("renders comment stream", async () => {
  // Wait for loading.
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("show all replies", async () => {
  testRenderer.root
    .findByProps({ id: `talk-reply-list--show-all--${comments[0].id}` })
    .props.onClick();

  // Wait for loading.
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});
