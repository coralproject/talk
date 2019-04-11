import { EventEmitter2 } from "eventemitter2";
import { IResolvers } from "graphql-tools";
import { noop } from "lodash";
import path from "path";
import React from "react";
import TestRenderer, { ReactTestRenderer } from "react-test-renderer";
import { Environment, RecordProxy, RecordSourceProxy } from "relay-runtime";

import { TalkContext, TalkContextProvider } from "talk-framework/lib/bootstrap";
import { PostMessageService } from "talk-framework/lib/postMessage";
import { RestClient } from "talk-framework/lib/rest";
import { createPromisifiedStorage } from "talk-framework/lib/storage";
import { createUUIDGenerator } from "talk-framework/testHelpers";

import createFluentBundle from "./createFluentBundle";
import createRelayEnvironment from "./createRelayEnvironment";

export type Resolver<V, R> = (
  parent: any,
  args: V,
  context: any,
  info: any
) => R;

export interface Resolvers<Q extends Resolver<any, any> = any, M = any> {
  Query?: Q;
  Mutation?: M;
}

export interface TestResolvers<T extends Resolvers = any> {
  Query?: { [P in keyof Required<T>["Query"]]: (() => any) };
  Mutation?: { [P in keyof Required<T>["Mutation"]]: (() => any) };
}

function createNodeMock(element: React.ReactElement<any>) {
  if (element.type === "div") {
    return {
      innerHtml: "",
      className: "",
      focus: noop,
    };
  }
  return null;
}

export interface CreateTestRendererParams<T extends Resolvers = any> {
  logNetwork?: boolean;
  muteNetworkErrors?: boolean;
  resolvers?: TestResolvers<T>;
  browserInfo?: TalkContext["browserInfo"];
  initLocalState?: (
    local: RecordProxy,
    source: RecordSourceProxy,
    environment: Environment
  ) => void;
}

export default function createTestRenderer<
  T extends { Query?: any; Mutation?: any } = any
>(
  target: string,
  element: React.ReactNode,
  params: CreateTestRendererParams<T>
) {
  const environment = createRelayEnvironment({
    network: {
      // Set this to true, to see graphql responses.
      logNetwork: params.logNetwork,
      resolvers: params.resolvers as IResolvers<any, any>,
      muteNetworkErrors: params.muteNetworkErrors,
      projectName: "tenant",
    },
    initLocalState: (localRecord, source, env) => {
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, env);
      }
    },
  });

  const context: TalkContext = {
    relayEnvironment: environment,
    locales: ["en-US"],
    localeBundles: [
      createFluentBundle(
        target,
        path.resolve(__dirname, "../../../../locales/en-US")
      ),
    ],
    localStorage: createPromisifiedStorage(),
    sessionStorage: createPromisifiedStorage(),
    rest: new RestClient("http://localhost/api"),
    postMessage: new PostMessageService(),
    browserInfo: params.browserInfo || { ios: false },
    uuidGenerator: createUUIDGenerator(),
    eventEmitter: new EventEmitter2({ wildcard: true, maxListeners: 20 }),
    clearSession: () => Promise.resolve(),
  };

  let testRenderer: ReactTestRenderer;
  TestRenderer.act(() => {
    testRenderer = TestRenderer.create(
      <TalkContextProvider value={context}>{element}</TalkContextProvider>,
      { createNodeMock }
    );
  });
  return { context, testRenderer: testRenderer! };
}
