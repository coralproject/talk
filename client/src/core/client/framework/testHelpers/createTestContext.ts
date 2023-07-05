/* eslint-disable no-restricted-globals */
import { IResolvers } from "@graphql-tools/utils";
import { EventEmitter2 } from "eventemitter2";
import FDBFactory from "fake-indexeddb/lib/FDBFactory";
import path from "path";
import { Environment, RecordProxy, RecordSourceProxy } from "relay-runtime";
import sinon from "sinon";

import { RequireProperty } from "coral-common/types";
import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  CONNECTION_STATUS,
  ConnectionStatusListenerCallback,
} from "coral-framework/lib/network";
import { PostMessageService } from "coral-framework/lib/postMessage";
import { RestClient } from "coral-framework/lib/rest";
import {
  createInMemoryStorage,
  createPromisifiedStorage,
} from "coral-framework/lib/storage";
import createIndexedDBStorage from "coral-framework/lib/storage/IndexedDBStorage";
import { createUUIDGenerator } from "coral-framework/testHelpers";

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

export default function createTestContext<
  T extends { Query?: any; Mutation?: any } = any
>(target: string, params: CreateTestRendererParams<T>) {
  const subscriptionHandler = createSubscriptionHandler();
  const environment = createRelayEnvironment({
    network: {
      // Set this to true, to see graphql responses.
      logNetwork: params.logNetwork,
      resolvers: params.resolvers as IResolvers<any, any>,
      muteNetworkErrors: params.muteNetworkErrors,
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
    subscriptionClient: {
      subscribe: () => {
        return {
          dispose: () => {},
        };
      },
      pause: () => {},
      resume: () => {},
      setAccessToken: () => {},
      getConnectionStatus: () => CONNECTION_STATUS.CONNECTED,
      on: (
        status: CONNECTION_STATUS.CONNECTED,
        callback: ConnectionStatusListenerCallback
      ) => {
        return () => {};
      },
    },
    localStorage: createPromisifiedStorage(),
    sessionStorage: createPromisifiedStorage(),
    indexedDBStorage: createIndexedDBStorage("coral", new FDBFactory()),
    inMemoryStorage: createInMemoryStorage(),
    rest: new RestClient("http://localhost/api"),
    postMessage: new PostMessageService(window, "coral", window, "*"),
    browserInfo: params.browserInfo || {
      supports: {
        intersectionObserver: true,
        resizeObserver: true,
        fetch: true,
        intl: true,
        intlPluralRules: true,
      },
      version: 10.0,
      ios: false,
      mobile: false,
      tablet: false,
      msie: false,
      macOS: false,
      iPadOS: false,
    },
    uuidGenerator: createUUIDGenerator(),
    eventEmitter: new EventEmitter2({ wildcard: true, maxListeners: 20 }),
    clearSession: sinon.stub(),
    changeLocale: sinon.stub(),
    transitionControl: {
      allowTransition: true,
      history: [],
    },
    tokenRefreshProvider: {
      register: () => () => {},
      refreshToken: () => "",
    },
    window,
    renderWindow: window,
    rootURL: "",
  };

  return {
    context,
    subscriptionHandler: subscriptionHandler as SubscriptionHandlerReadOnly,
  };
}
