import React from "react";
import TestRenderer, { ReactTestRenderer } from "react-test-renderer";
import { RecordProxy } from "relay-runtime";

import { timeout } from "talk-common/utils";
import { TalkContext, TalkContextProvider } from "talk-framework/lib/bootstrap";
import { PostMessageService } from "talk-framework/lib/postMessage";
import { RestClient } from "talk-framework/lib/rest";
import { createInMemoryStorage } from "talk-framework/lib/storage";
import AppContainer from "talk-stream/containers/AppContainer";

import createEnvironment from "./createEnvironment";
import createFluentBundle from "./createFluentBundle";
import createNodeMock from "./createNodeMock";

let testRenderer: ReactTestRenderer;
beforeEach(() => {
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

it("renders permalink view with unknown asset", async () => {
  // Wait for loading.
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});
