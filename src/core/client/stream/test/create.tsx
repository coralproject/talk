import { EventEmitter2 } from "eventemitter2";
import { IResolvers } from "graphql-tools";
import React from "react";
import TestRenderer, { ReactTestRenderer } from "react-test-renderer";
import { Environment, RecordProxy, RecordSourceProxy } from "relay-runtime";

import { TalkContext, TalkContextProvider } from "talk-framework/lib/bootstrap";
import { PostMessageService } from "talk-framework/lib/postMessage";
import { RestClient } from "talk-framework/lib/rest";
import { createPromisifiedStorage } from "talk-framework/lib/storage";
import { createUUIDGenerator } from "talk-framework/testHelpers";

import createEnvironment from "./createEnvironment";
import createFluentBundle from "./createFluentBundle";
import createNodeMock from "./createNodeMock";

import AppContainer from "../containers/AppContainer";

export interface CreateParams {
  logNetwork?: boolean;
  muteNetworkErrors?: boolean;
  resolvers: IResolvers<any, any>;
  initLocalState?: (
    local: RecordProxy,
    source: RecordSourceProxy,
    environment: Environment
  ) => void;
}

export default function create(params: CreateParams) {
  const environment = createEnvironment({
    // Set this to true, to see graphql responses.
    logNetwork: params.logNetwork,
    resolvers: params.resolvers,
    muteNetworkErrors: params.muteNetworkErrors,
    initLocalState: (localRecord, source, env) => {
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, env);
      }
    },
  });

  const context: TalkContext = {
    relayEnvironment: environment,
    locales: ["en-US"],
    localeBundles: [createFluentBundle()],
    localStorage: createPromisifiedStorage(),
    sessionStorage: createPromisifiedStorage(),
    rest: new RestClient("http://localhost/api"),
    postMessage: new PostMessageService(),
    browserInfo: { ios: false },
    uuidGenerator: createUUIDGenerator(),
    eventEmitter: new EventEmitter2({ wildcard: true, maxListeners: 20 }),
    clearSession: () => Promise.resolve(),
  };

  let testRenderer: ReactTestRenderer;
  TestRenderer.act(() => {
    testRenderer = TestRenderer.create(
      <TalkContextProvider value={context}>
        <AppContainer />
      </TalkContextProvider>,
      { createNodeMock }
    );
  });
  return { context, testRenderer: testRenderer! };
}
