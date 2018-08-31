import React from "react";
import TestRenderer, { ReactTestRenderer } from "react-test-renderer";
import { RecordProxy } from "relay-runtime";

import { timeout } from "talk-common/utils";
import { TalkContext, TalkContextProvider } from "talk-framework/lib/bootstrap";
import { PostMessageService } from "talk-framework/lib/postMessage";
import { RestClient } from "talk-framework/lib/rest";
import { createInMemoryStorage } from "talk-framework/lib/storage";
import { createSinonStub } from "talk-framework/testHelpers";
import AppContainer from "talk-stream/containers/AppContainer";

import createEnvironment from "./createEnvironment";
import createFluentBundle from "./createFluentBundle";
import createNodeMock from "./createNodeMock";
import { assets, users } from "./fixtures";

let testRenderer: ReactTestRenderer;
beforeEach(() => {
  const resolvers = {
    Query: {
      asset: createSinonStub(
        s => s.throws(),
        s => s.withArgs(undefined, { id: assets[0].id }).returns(assets[0])
      ),
      me: createSinonStub(
        s => s.throws(),
        s => s.withArgs(undefined, { clientAuthRevision: 0 }).returns(users[0])
      ),
    },
    Mutation: {
      createComment: createSinonStub(
        s => s.throws(),
        s =>
          s
            .withArgs(undefined, {
              input: {
                assetID: assets[0].id,
                body: "<strong>Hello world!</strong>",
                clientMutationId: "0",
              },
            })
            .returns({
              commentEdge: {
                cursor: "2018-07-06T18:24:00.000Z",
                node: {
                  id: "comment-x",
                  author: users[0],
                  body: "<strong>Hello world</strong>",
                  createdAt: "2018-07-06T18:24:00.000Z",
                },
              },
              clientMutationId: "0",
            })
      ),
    },
  };

  const environment = createEnvironment({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: (localRecord: RecordProxy) => {
      localRecord.setValue(assets[0].id, "assetID");
      localRecord.setValue(0, "authRevision");
    },
  });

  const context: TalkContext = {
    relayEnvironment: environment,
    localeBundles: [createFluentBundle()],
    localStorage: createInMemoryStorage(),
    sessionStorage: createInMemoryStorage(),
    rest: new RestClient("http://localhost/api"),
    postMessage: new PostMessageService(),
  };

  testRenderer = TestRenderer.create(
    <TalkContextProvider value={context}>
      <AppContainer />
    </TalkContextProvider>,
    { createNodeMock }
  );
});

it("renders comment stream", async () => {
  // Wait for loading.
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("post a comment", async () => {
  testRenderer.root
    .findByProps({ inputId: "comments-postCommentForm-field" })
    .props.onChange({ html: "<strong>Hello world!</strong>" });

  testRenderer.root
    .findByProps({ id: "comments-postCommentForm-form" })
    .props.onSubmit();

  // Wait for loading.
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});
