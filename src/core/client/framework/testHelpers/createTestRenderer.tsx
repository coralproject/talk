import { EventEmitter2 } from "eventemitter2";
import { IResolvers } from "graphql-tools";
import path from "path";
import React from "react";
import TestRenderer, { ReactTestRenderer } from "react-test-renderer";
import { Environment, RecordProxy, RecordSourceProxy } from "relay-runtime";
import sinon from "sinon";

import { RequireProperty } from "coral-common/types";
import {
  CoralContext,
  CoralContextProvider,
} from "coral-framework/lib/bootstrap";
import { PostMessageService } from "coral-framework/lib/postMessage";
import { RestClient } from "coral-framework/lib/rest";
import { createPromisifiedStorage } from "coral-framework/lib/storage";
import { act, createUUIDGenerator } from "coral-framework/testHelpers";

import createFluentBundle from "./createFluentBundle";
import createRelayEnvironment from "./createRelayEnvironment";
import createSubscriptionHandler, {
  SubscriptionHandlerReadOnly,
} from "./createSubscriptionHandler";

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
  Query?: { [P in keyof Required<T>["Query"]]?: () => any };
  Mutation?: { [P in keyof Required<T>["Mutation"]]?: () => any };
}

function createNodeMock(element: React.ReactElement<any>) {
  if (typeof element.type === "string") {
    return document.createElement(element.type);
  }
  return null;
}

export interface CreateTestRendererParams<T extends Resolvers = any> {
  logNetwork?: boolean;
  muteNetworkErrors?: boolean;
  resolvers?: TestResolvers<T>;
  browserInfo?: CoralContext["browserInfo"];
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
  const subscriptionHandler = createSubscriptionHandler();
  const environment = createRelayEnvironment({
    network: {
      // Set this to true, to see graphql responses.
      logNetwork: params.logNetwork,
      resolvers: params.resolvers as IResolvers<any, any>,
      muteNetworkErrors: params.muteNetworkErrors,
      projectName: "tenant",
      subscriptionHandler,
    },
    initLocalState: (localRecord, source, env) => {
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, env);
      }
    },
  });

  const context: RequireProperty<CoralContext, "transitionControl"> = {
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
    browserInfo: params.browserInfo || {
      supports: {
        cssVariables: true,
        intersectionObserver: true,
        fetch: true,
        intl: true,
        intlPluralRules: true,
        proxyObject: true,
      },
      version: 10.0,
      ios: false,
      mobile: false,
      msie: false,
    },
    uuidGenerator: createUUIDGenerator(),
    eventEmitter: new EventEmitter2({ wildcard: true, maxListeners: 20 }),
    clearSession: sinon.stub(),
    changeLocale: sinon.stub(),
    transitionControl: {
      allowTransition: true,
      history: [],
    },
  };

  let testRenderer: ReactTestRenderer;
  act(() => {
    testRenderer = TestRenderer.create(
      <CoralContextProvider value={context}>{element}</CoralContextProvider>,
      { createNodeMock }
    );
  });
  return {
    context,
    testRenderer: testRenderer!,
    subscriptionHandler: subscriptionHandler as SubscriptionHandlerReadOnly,
  };
}
