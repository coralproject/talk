import { Localized } from "@fluent/react/compat";
import { EventEmitter2 } from "eventemitter2";
import { noop } from "lodash";
import { Child as PymChild } from "pym.js";
import React, { Component, ComponentType } from "react";
import { Formatter } from "react-timeago";
import { Environment, RecordSource, Store } from "relay-runtime";
import { v1 as uuid } from "uuid";

import { StaticConfig } from "coral-common/config";
import { LanguageCode } from "coral-common/helpers/i18n";
import getOrigin from "coral-common/utils/getOrigin";
import {
  injectConditionalPolyfills,
  onPymMessage,
  potentiallyInjectAxe,
} from "coral-framework/helpers";
import polyfillIntlLocale from "coral-framework/helpers/polyfillIntlLocale";
import { getBrowserInfo } from "coral-framework/lib/browserInfo";
import {
  createReporter,
  setGlobalErrorReporter,
} from "coral-framework/lib/errors";
import { RestClient } from "coral-framework/lib/rest";
import {
  createLocalStorage,
  createPostMessageStorage,
  createPromisifiedStorage,
  createSessionStorage,
  PromisifiedStorage,
} from "coral-framework/lib/storage";
import { ClickFarAwayRegister } from "coral-ui/components/v2/ClickOutside";

import {
  AccessTokenProvider,
  AuthState,
  deleteAccessTokenFromLocalStorage,
  parseAccessToken,
  retrieveAccessToken,
  storeAccessTokenInLocalStorage,
} from "../auth";
import getStaticConfig from "../getStaticConfig";
import { generateBundles, LocalesData } from "../i18n";
import {
  createManagedSubscriptionClient,
  createNetwork,
  ManagedSubscriptionClient,
} from "../network";
import { TokenRefreshProvider } from "../network/tokenRefreshProvider";
import { PostMessageService } from "../postMessage";
import { LOCAL_ID } from "../relay";
import createIndexedDBStorage from "../storage/IndexedDBStorage";
import { CoralContext, CoralContextProvider } from "./CoralContext";
import SendPymReady from "./SendPymReady";

export type InitLocalState = (dependencies: {
  environment: Environment;
  context: CoralContext;
  auth?: AuthState | null;
  staticConfig?: StaticConfig | null;
}) => void | Promise<void>;

interface CreateContextArguments {
  /** Locales data that is returned by our `locales-loader`. */
  localesData: LocalesData;

  /** Init will be called after the context has been created. */
  initLocalState?: InitLocalState;

  /** Access token that should be used instead of what's currently in storage */
  accessToken?: string;

  /** A pym child that interacts with the pym parent. */
  pym?: PymChild;

  /** Supports emitting and listening to events. */
  eventEmitter?: EventEmitter2;

  /**
   * If true will prompt for additional details during error..
   */
  reporterFeedbackPrompt?: boolean;

  /** bundle is the specific source of the connection */
  bundle: string;

  /** bundleConfig is the configuration parameters for this bundle */
  bundleConfig?: Record<string, string>;

  /** tokenRefreshProvider is used to obtain a new access token after expiry. */
  tokenRefreshProvider?: TokenRefreshProvider;
}

/**
 * timeagoFormatter integrates timeago into our translation
 * framework. It gets injected into the UIContext.
 */
export const timeagoFormatter: Formatter = (value, unit, suffix) => {
  // We use 'in' instead of 'from now' for language consistency
  const ourSuffix = suffix === "from now" ? "noSuffix" : suffix;

  if (unit === "second" && suffix === "ago") {
    return (
      <Localized id="framework-timeago-just-now">
        <span>Just now</span>
      </Localized>
    );
  }

  return (
    <Localized
      id="framework-timeago"
      $value={value}
      $unit={unit}
      $suffix={ourSuffix}
    >
      <span>now</span>
    </Localized>
  );
};

/**
 * Returns true if we are in an iframe.
 */
function areWeInIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

function createRelayEnvironment(
  subscriptionClient: ManagedSubscriptionClient,
  clientID: string,
  tokenRefreshProvider?: TokenRefreshProvider,
  clearCacheBefore?: Date
) {
  const source = new RecordSource();
  const accessTokenProvider: AccessTokenProvider = () => {
    const local = source.get(LOCAL_ID);
    if (!local) {
      return;
    }

    return local.accessToken as string | undefined;
  };
  const environment = new Environment({
    network: createNetwork(
      subscriptionClient,
      clientID,
      accessTokenProvider,
      tokenRefreshProvider?.refreshToken,
      clearCacheBefore
    ),
    store: new Store(source),
  });

  return { environment, accessTokenProvider };
}

function createRestClient(
  clientID: string,
  accessTokenProvider: AccessTokenProvider
) {
  return new RestClient("/api", clientID, accessTokenProvider);
}

/**
 * Returns a managed CoralContextProvider, that includes given context
 * and handles context changes, e.g. when a user session changes.
 */
function createManagedCoralContextProvider(
  context: CoralContext,
  subscriptionClient: ManagedSubscriptionClient,
  clientID: string,
  initLocalState: InitLocalState,
  localesData: LocalesData,
  ErrorBoundary?: React.ComponentType
) {
  const ManagedCoralContextProvider = class ManagedCoralContextProvider extends Component<
    {},
    { context: CoralContext }
  > {
    constructor(props: {}) {
      super(props);
      this.state = {
        context: {
          ...context,
          clearSession: this.clearSession,
          changeLocale: this.changeLocale,
        },
      };
    }

    // This is called every time a user session starts or ends.
    private clearSession = async (
      nextAccessToken?: string,
      options: { ephemeral?: boolean } = {}
    ) => {
      // Clear session storage on logouts otherwise keep it!
      if (!nextAccessToken) {
        void this.state.context.sessionStorage.clear();
      }

      // Pause subscriptions.
      subscriptionClient.pause();

      // Parse the claims/token and update storage.
      const auth = nextAccessToken
        ? options.ephemeral
          ? parseAccessToken(nextAccessToken)
          : await storeAccessTokenInLocalStorage(
              context.localStorage,
              nextAccessToken
            )
        : await deleteAccessTokenFromLocalStorage(context.localStorage);

      // Create the new environment.
      const { environment, accessTokenProvider } = createRelayEnvironment(
        subscriptionClient,
        clientID,
        this.state.context.tokenRefreshProvider,
        // Disable the cache on requests for the next 30 seconds.
        new Date(Date.now() + 30 * 1000)
      );

      // Create the new context.
      const newContext: CoralContext = {
        ...this.state.context,
        relayEnvironment: environment,
        rest: createRestClient(clientID, accessTokenProvider),
      };

      // Initialize local state.
      await initLocalState({
        environment: newContext.relayEnvironment,
        context: newContext,
        auth,
        staticConfig: getStaticConfig(),
      });

      // Update the subscription client access token.
      subscriptionClient.setAccessToken(accessTokenProvider());

      // Propagate new context.
      this.setState({ context: newContext }, () => {
        // Resume subscriptions after context has changed.
        subscriptionClient.resume();
      });
    };

    // This is called when the locale should change.
    private changeLocale = async (locale: LanguageCode) => {
      // Add fallback locale.
      const locales = [localesData.fallbackLocale];
      if (locale && locale !== localesData.fallbackLocale) {
        locales.splice(0, 0, locale);
      }
      const localeBundles = await generateBundles(locales, localesData);
      const newContext = {
        ...this.state.context,
        locales,
        localeBundles,
      };
      // Propagate new context.
      this.setState({
        context: newContext,
      });
    };

    public render() {
      // If the boundary is available from the reporter (also, if it's
      // available) then use it to wrap the lower children for any error that
      // happens.
      return (
        <CoralContextProvider value={this.state.context}>
          {ErrorBoundary ? (
            <ErrorBoundary>{this.props.children}</ErrorBoundary>
          ) : (
            this.props.children
          )}
          {this.state.context.pym && <SendPymReady />}
        </CoralContextProvider>
      );
    }
  };

  return ManagedCoralContextProvider;
}

/**
 * resolveLocalStorage decides which local storage to use in the context
 */
function resolveLocalStorage(
  postMessage?: PostMessageService
): PromisifiedStorage {
  if (postMessage && areWeInIframe()) {
    // Use local storage over postMessage when we are in an iframe.
    return createPostMessageStorage(postMessage, "localStorage");
  }
  // Use promisified, prefixed local storage.
  return createPromisifiedStorage(createLocalStorage());
}

/**
 * resolveSessionStorage decides which session storage to use in the context
 */
function resolveSessionStorage(
  postMessage?: PostMessageService
): PromisifiedStorage {
  if (postMessage && areWeInIframe()) {
    // Use session storage over postMessage when we are in an iframe.
    return createPostMessageStorage(postMessage, "sessionStorage");
  }
  // Use promisified, prefixed session storage.
  return createPromisifiedStorage(createSessionStorage());
}
/**
 * resolveIndexedDBStorage decides which indexeddb storage to use in the context
 */
function resolveIndexedDBStorage(
  postMessage?: PostMessageService
): PromisifiedStorage<any> {
  if (postMessage && areWeInIframe()) {
    // Use session storage over postMessage when we are in an iframe.
    return createPostMessageStorage(postMessage, "indexedDB");
  }
  // Use promisified, prefixed session storage.
  return createIndexedDBStorage("keyvalue");
}

function resolveGraphQLSubscriptionURI(
  staticConfig: StaticConfig | null
): string {
  if (staticConfig && staticConfig.graphQLSubscriptionURI) {
    return staticConfig.graphQLSubscriptionURI;
  }

  return `${location.protocol === "https:" ? "wss" : "ws"}://${
    location.host
  }/api/graphql/live`;
}

/**
 * `createManaged` establishes the dependencies of our framework
 * and returns a `ManagedCoralContextProvider` that provides the context
 * to the rest of the application.
 */
export default async function createManaged({
  initLocalState = noop,
  localesData,
  pym,
  eventEmitter = new EventEmitter2({ wildcard: true, maxListeners: 20 }),
  bundle,
  bundleConfig = {},
  tokenRefreshProvider,
  reporterFeedbackPrompt = false,
}: CreateContextArguments): Promise<ComponentType> {
  // Load any polyfills that are required.
  await injectConditionalPolyfills();

  // Potentially inject react-axe for runtime a11y checks.
  await potentiallyInjectAxe(pym?.parentUrl);

  const reporter = createReporter({ reporterFeedbackPrompt });
  // Set error reporter.
  if (reporter) {
    setGlobalErrorReporter(reporter);
  }

  // Listen for outside clicks.
  let registerClickFarAway: ClickFarAwayRegister | undefined;
  if (pym) {
    registerClickFarAway = (cb) => {
      return onPymMessage(pym, "click", cb);
    };
  }

  const postMessage = new PostMessageService(
    "coral",
    window.parent,
    pym ? getOrigin(pym.parentUrl) : "*"
  );

  // Initialize i18n.
  const locales = [localesData.fallbackLocale];
  if (
    document.documentElement.lang &&
    document.documentElement.lang !== localesData.fallbackLocale
  ) {
    // Use locale specified by the server.
    locales.splice(0, 0, document.documentElement.lang);
  } else if (
    localesData.defaultLocale &&
    localesData.defaultLocale !== localesData.fallbackLocale
  ) {
    // Use default locale.
    locales.splice(0, 0, localesData.defaultLocale);
  }

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug(`using locales ${JSON.stringify(locales)}`);
  }

  const localeBundles = await generateBundles(locales, localesData);
  await polyfillIntlLocale(locales);

  const localStorage = resolveLocalStorage(postMessage);

  // Get the access token from storage.
  const auth = await retrieveAccessToken(localStorage);

  /** clientID is sent to the server with every request */
  const clientID = uuid();

  const staticConfig = getStaticConfig();

  // websocketEndpoint points to our graphql server's live endpoint.
  const graphQLSubscriptionURI = resolveGraphQLSubscriptionURI(staticConfig);

  const subscriptionClient = createManagedSubscriptionClient(
    graphQLSubscriptionURI,
    clientID,
    bundle,
    bundleConfig
  );

  const { environment, accessTokenProvider } = createRelayEnvironment(
    subscriptionClient,
    clientID,
    tokenRefreshProvider
  );

  // Assemble context.
  const context: CoralContext = {
    subscriptionClient,
    relayEnvironment: environment,
    locales,
    localeBundles,
    timeagoFormatter,
    pym,
    eventEmitter,
    registerClickFarAway,
    rest: createRestClient(clientID, accessTokenProvider),
    postMessage,
    localStorage,
    sessionStorage: resolveSessionStorage(postMessage),
    indexedDBStorage: resolveIndexedDBStorage(postMessage),
    browserInfo: getBrowserInfo(),
    uuidGenerator: uuid,
    // Noop, this is later replaced by the
    // managed CoralContextProvider.
    clearSession: (nextAccessToken?: string | null) => Promise.resolve(),
    // Noop, this is later replaced by the
    // managed CoralContextProvider.
    changeLocale: (locale?: LanguageCode) => Promise.resolve(),
    tokenRefreshProvider,
  };

  // Initialize local state.
  await initLocalState({
    environment: context.relayEnvironment,
    context,
    auth,
    staticConfig,
  });

  // Set new token for the websocket connection.
  // TODO: (cvle) dynamically reset when token changes.
  // ^ only necessary when we can prolong existing session using a new token.
  subscriptionClient.setAccessToken(accessTokenProvider());

  // Returns a managed CoralContextProvider, that includes the above
  // context and handles context changes, e.g. when a user session changes.
  return createManagedCoralContextProvider(
    context,
    subscriptionClient,
    clientID,
    initLocalState,
    localesData,
    reporter?.ErrorBoundary
  );
}
