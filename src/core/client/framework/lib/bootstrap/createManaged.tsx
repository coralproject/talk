import { FluentBundle } from "@fluent/bundle/compat";
/* eslint-disable no-restricted-globals */
import { Localized } from "@fluent/react/compat";
import { EventEmitter2 } from "eventemitter2";
import { noop } from "lodash";
import React, { Component, ComponentType } from "react";
import { Formatter } from "react-timeago";
import { Environment, RecordSource, Store } from "relay-runtime";
import { v1 as uuid } from "uuid";

import { StaticConfig } from "coral-common/config";
import { LanguageCode } from "coral-common/helpers/i18n";
import ensureEndSlash from "coral-common/utils/ensureEndSlash";
import getHost from "coral-common/utils/getHost";
import {
  injectConditionalPolyfills,
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
  createInMemoryStorage,
  createLocalStorage,
  createPromisifiedStorage,
  createSessionStorage,
  PromisifiedStorage,
} from "coral-framework/lib/storage";
import SetAccessTokenMutation from "coral-framework/mutations/SetAccessTokenMutation";
import getLocationOrigin from "coral-framework/utils/getLocationOrigin";

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
import {
  createTokenRefreshProvider,
  TokenRefreshProvider,
} from "../network/tokenRefreshProvider";
import { PostMessageService } from "../postMessage";
import { LOCAL_ID } from "../relay";
import createIndexedDBStorage from "../storage/IndexedDBStorage";
import { CoralContext, CoralContextProvider } from "./CoralContext";
import SendReady from "./SendReady";

export type InitLocalState = (dependencies: {
  environment: Environment;
  context: CoralContext;
  auth?: AuthState | null;
  staticConfig?: StaticConfig | null;
}) => void | Promise<void>;

export type RefreshAccessTokenPromise = () => Promise<string>;

declare let __webpack_public_path__: string;
interface CreateContextArguments {
  /** URL of the Coral server */
  rootURL?: string;

  /** ISO Code of language to use */
  lang?: string;

  /** Locales data that is returned by our `locales-loader`. */
  localesData: LocalesData;

  /** Init will be called after the context has been created. */
  initLocalState?: InitLocalState;

  /** Access token that should be used instead of what's currently in storage */
  accessToken?: string;

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

  /** Replace graphql subscrition url. */
  graphQLSubscriptionURI?: string;

  /** A promise that returns the next acess token when expired */
  refreshAccessTokenPromise?: RefreshAccessTokenPromise;

  /** Static Config from the server necessary to start the client*/
  staticConfig?: StaticConfig | null;

  /** Supports a custom scroll container element if Coral is rendered outside
   * of the render window
   */
  customScrollContainer?: HTMLElement;
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
    <Localized id="framework-timeago" vars={{ value, unit, suffix: ourSuffix }}>
      <span>now</span>
    </Localized>
  );
};

function createRelayEnvironment(
  rootURL: string,
  subscriptionClient: ManagedSubscriptionClient,
  clientID: string,
  localeBundles: FluentBundle[],
  tokenRefreshProvider: TokenRefreshProvider,
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
      `${rootURL}/api/graphql`,
      subscriptionClient,
      clientID,
      accessTokenProvider,
      localeBundles,
      tokenRefreshProvider.refreshToken,
      clearCacheBefore
    ),
    store: new Store(source),
  });

  return { environment, accessTokenProvider };
}

function createRestClient(
  rootURL: string,
  clientID: string,
  accessTokenProvider: AccessTokenProvider
) {
  return new RestClient(`${rootURL}/api`, clientID, accessTokenProvider);
}

function determineLocales(localesData: LocalesData, lang: string) {
  const locales = [localesData.fallbackLocale];
  if (lang && lang !== localesData.fallbackLocale) {
    // Use locale specified by the server.
    locales.splice(0, 0, lang);
  } else if (
    localesData.defaultLocale &&
    localesData.defaultLocale !== localesData.fallbackLocale
  ) {
    // Use default locale.
    locales.splice(0, 0, localesData.defaultLocale);
  }
  return locales;
}

/**
 * Returns a managed CoralContextProvider, that includes given context
 * and handles context changes, e.g. when a user session changes.
 */
function createManagedCoralContextProvider(
  rootURL: string,
  context: CoralContext,
  subscriptionClient: ManagedSubscriptionClient,
  clientID: string,
  initLocalState: InitLocalState,
  localesData: LocalesData,
  ErrorBoundary?: React.ComponentType<{ children?: React.ReactNode }>,
  refreshAccessTokenPromise?: RefreshAccessTokenPromise,
  staticConfig?: StaticConfig | null
) {
  const ManagedCoralContextProvider = class ManagedCoralContextProvider extends Component<
    { children?: React.ReactNode },
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
      if (refreshAccessTokenPromise) {
        context.tokenRefreshProvider.register(async () => {
          const token = await refreshAccessTokenPromise();
          if (token) {
            await SetAccessTokenMutation.commit(
              this.state.context.relayEnvironment,
              {
                accessToken: token,
                ephemeral: true,
                refresh: true,
              },
              this.state.context
            );
            return token;
          }
          return "";
        });
      }
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
        rootURL,
        subscriptionClient,
        clientID,
        this.state.context.localeBundles,
        this.state.context.tokenRefreshProvider,
        // Disable the cache on requests for the next 30 seconds.
        new Date(Date.now() + 30 * 1000)
      );

      // Create the new context.
      const newContext: CoralContext = {
        ...this.state.context,
        relayEnvironment: environment,
        rest: createRestClient(rootURL, clientID, accessTokenProvider),
      };

      // Initialize local state.
      await initLocalState({
        environment: newContext.relayEnvironment,
        context: newContext,
        auth,
        staticConfig,
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
      // Initialize i18n.
      const locales = determineLocales(localesData, locale);
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
          <SendReady />
        </CoralContextProvider>
      );
    }
  };

  return ManagedCoralContextProvider;
}

/*
 * resolveStorage decides which storage to use in the context
 */
function resolveStorage(
  type: "localStorage" | "sessionStorage" | "indexedDB"
): PromisifiedStorage {
  switch (type) {
    case "localStorage":
      return createPromisifiedStorage(createLocalStorage(window));
    case "sessionStorage":
      return createPromisifiedStorage(createSessionStorage(window));
    case "indexedDB":
      return createIndexedDBStorage("keyvalue", window.indexedDB);
  }
  throw new Error(`Unknown type ${type}`);
}

function resolveGraphQLSubscriptionURI(
  rootURL: string,
  staticConfig: StaticConfig | null
): string {
  if (staticConfig && staticConfig.graphQLSubscriptionURI) {
    return staticConfig.graphQLSubscriptionURI;
  }

  let host = getHost(rootURL);

  // TODO: (cvle) Remove following block, when nginx proxy workaround is no longer necessary.
  if (process.env.NODE_ENV !== "development") {
    if (staticConfig?.tenantDomain) {
      host = staticConfig.tenantDomain;
      if (location.port !== "80" && location.port !== "443") {
        host += `:${location.port}`;
      }
    }
  }
  //

  return `${
    location.protocol === "https:" ? "wss" : "ws"
  }://${host}/api/graphql/live`;
}

/**
 * `createManaged` establishes the dependencies of our framework
 * and returns a `ManagedCoralContextProvider` that provides the context
 * to the rest of the application.
 */
export default async function createManaged({
  rootURL = getLocationOrigin(window),
  lang = document.documentElement.lang,
  initLocalState = noop,
  localesData,
  eventEmitter = new EventEmitter2({ wildcard: true, maxListeners: 1000 }),
  bundle,
  bundleConfig = {},
  reporterFeedbackPrompt = false,
  graphQLSubscriptionURI,
  refreshAccessTokenPromise,
  staticConfig = getStaticConfig(window),
  customScrollContainer,
}: CreateContextArguments): Promise<
  ComponentType<{ children?: React.ReactNode }>
> {
  if (!staticConfig) {
    // eslint-disable-next-line no-console
    console.warn("No static config found or provided");
  }

  // Set Webpack Public Path.
  __webpack_public_path__ = ensureEndSlash(staticConfig?.staticURI || rootURL);

  const tokenRefreshProvider = createTokenRefreshProvider();
  const browserInfo = getBrowserInfo(window);
  // Load any polyfills that are required.
  await injectConditionalPolyfills(window, browserInfo);

  // Potentially inject react-axe for runtime a11y checks.
  await potentiallyInjectAxe(window.location.href, browserInfo);

  const reporter = createReporter({
    reporter: staticConfig?.reporter,
    reporterFeedbackPrompt,
  });
  // Set error reporter.
  if (reporter) {
    setGlobalErrorReporter(reporter);
  }

  const postMessage = new PostMessageService(
    window,
    "coral",
    window,
    window.location.origin
  );

  // Initialize i18n.
  const locales = determineLocales(localesData, lang);

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug(`using locales ${JSON.stringify(locales)}`);
  }

  const localeBundles = await generateBundles(locales, localesData);
  await polyfillIntlLocale(locales, browserInfo);

  const localStorage = resolveStorage("localStorage");

  // Get the access token from storage.
  const auth = await retrieveAccessToken(localStorage);

  /** clientID is sent to the server with every request */
  const clientID = uuid();

  // websocketEndpoint points to our graphql server's live endpoint.
  graphQLSubscriptionURI =
    graphQLSubscriptionURI ||
    resolveGraphQLSubscriptionURI(rootURL, staticConfig);

  const subscriptionClient = createManagedSubscriptionClient(
    graphQLSubscriptionURI,
    clientID,
    bundle,
    bundleConfig
  );

  const { environment, accessTokenProvider } = createRelayEnvironment(
    rootURL,
    subscriptionClient,
    clientID,
    localeBundles,
    tokenRefreshProvider
  );

  // Assemble context.
  const context: CoralContext = {
    subscriptionClient,
    relayEnvironment: environment,
    locales,
    localeBundles,
    timeagoFormatter,
    eventEmitter,
    rest: createRestClient(rootURL, clientID, accessTokenProvider),
    postMessage,
    localStorage,
    sessionStorage: resolveStorage("sessionStorage"),
    indexedDBStorage: resolveStorage("indexedDB"),
    inMemoryStorage: createInMemoryStorage(),
    browserInfo,
    uuidGenerator: uuid,
    // Noop, this is later replaced by the
    // managed CoralContextProvider.
    clearSession: (nextAccessToken?: string | null) => Promise.resolve(),
    // Noop, this is later replaced by the
    // managed CoralContextProvider.
    changeLocale: (locale?: LanguageCode) => Promise.resolve(),
    tokenRefreshProvider,
    window,
    renderWindow: window,
    rootURL,
    customScrollContainer,
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
    rootURL,
    context,
    subscriptionClient,
    clientID,
    initLocalState,
    localesData,
    reporter?.ErrorBoundary,
    refreshAccessTokenPromise,
    staticConfig
  );
}
