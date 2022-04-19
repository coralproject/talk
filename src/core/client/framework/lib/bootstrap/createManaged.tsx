import { FluentBundle } from "@fluent/bundle/compat";
/* eslint-disable no-restricted-globals */
import { Localized } from "@fluent/react/compat";
import { EventEmitter2 } from "eventemitter2";
import { Child as PymChild } from "pym.js";
import React, {
  ComponentType,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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
  combinePromisifiedStorage,
  createInMemoryStorage,
  createLocalStorage,
  createPostMessageStorage,
  createPromisifiedStorage,
  createPymStorage,
  createSessionStorage,
  PromisifiedStorage,
} from "coral-framework/lib/storage";
import areWeInIframe from "coral-framework/utils/areWeInIframe";
import getLocationOrigin from "coral-framework/utils/getLocationOrigin";
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

function createRelayEnvironment(
  subscriptionClient: ManagedSubscriptionClient,
  clientID: string,
  localeBundles: FluentBundle[],
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
      `${getLocationOrigin(window)}/api/graphql`,
      subscriptionClient,
      clientID,
      accessTokenProvider,
      localeBundles,
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

type CreateLocalContextFunc = (
  context: CoralContext,
  auth?: AuthState | null
) => Promise<React.FunctionComponent<{}>>;

/**
 * Returns a managed CoralContextProvider, that includes given context
 * and handles context changes, e.g. when a user session changes.
 */
async function createManagedCoralContextProvider(
  initialContext: CoralContext,
  clientID: string,
  localesData: LocalesData,
  localeBundles: FluentBundle[],
  createLocalContext?: CreateLocalContextFunc,
  auth?: AuthState | null,
  ErrorBoundary?: React.ComponentType
) {
  let InitialLocal: FunctionComponent | null;
  if (createLocalContext) {
    InitialLocal = await createLocalContext(initialContext, auth);
  }

  const ManagedCoralContextProvider: FunctionComponent = ({ children }) => {
    const [context, setContext] = useState<CoralContext>(initialContext);
    const [Local, setLocal] = useState<FunctionComponent | null>(InitialLocal);

    // This is called when the locale should change.
    const changeLocale = useCallback(
      async (locale: LanguageCode) => {
        // Add fallback locale.
        const locales = [localesData.fallbackLocale];
        if (locale && locale !== localesData.fallbackLocale) {
          locales.splice(0, 0, locale);
        }
        const newContext = {
          ...context,
          locales,
          localeBundles,
        };

        setContext(newContext);
      },
      [context]
    );

    // This is called every time a user session starts or ends.
    const clearSession = useCallback(
      async (
        nextAccessToken?: string,
        options: { ephemeral?: boolean } = {}
      ) => {
        // Clear session storage on logouts otherwise keep it!
        if (!nextAccessToken) {
          void context.sessionStorage.clear();
        }

        // Pause subscriptions.
        context.subscriptionClient.pause();

        // Parse the claims/token and update storage.
        const newAuth = nextAccessToken
          ? options.ephemeral
            ? parseAccessToken(nextAccessToken)
            : await storeAccessTokenInLocalStorage(
                context.localStorage,
                nextAccessToken
              )
          : await deleteAccessTokenFromLocalStorage(context.localStorage);

        // Create the new environment.
        const { environment, accessTokenProvider } = createRelayEnvironment(
          context.subscriptionClient,
          clientID,
          localeBundles,
          context.tokenRefreshProvider,
          // Disable the cache on requests for the next 30 seconds.
          new Date(Date.now() + 30 * 1000)
        );

        // Create the new context.
        const newContext: CoralContext = {
          ...context,
          relayEnvironment: environment,
          rest: createRestClient(clientID, accessTokenProvider),
        };

        if (createLocalContext) {
          setLocal(await createLocalContext(context, newAuth));
        }

        // Update the subscription client access token.
        context.subscriptionClient.setAccessToken(accessTokenProvider());

        setContext(newContext);
        newContext.subscriptionClient.resume();
      },
      [context]
    );

    useEffect(() => {
      context.clearSession = clearSession;
      context.changeLocale = changeLocale;
    }, [changeLocale, clearSession, context]);

    const errorWrappedChildren = useMemo(() => {
      return (
        <>
          {ErrorBoundary ? <ErrorBoundary>{children}</ErrorBoundary> : children}
          {context.pym && <SendPymReady />}
        </>
      );
    }, [children, context.pym]);

    // If the boundary is available from the reporter (also, if it's
    // available) then use it to wrap the lower children for any error that
    // happens.
    return (
      <CoralContextProvider value={context}>
        {Local ? (
          <Local>{errorWrappedChildren}</Local>
        ) : (
          <>{errorWrappedChildren}</>
        )}
      </CoralContextProvider>
    );
  };

  return ManagedCoralContextProvider;
}

/*
 * resolveStorage decides which storage to use in the context
 */
function resolveStorage(
  type: "localStorage" | "sessionStorage" | "indexedDB",
  postMessage?: PostMessageService,
  pym?: PymChild
): PromisifiedStorage {
  if (areWeInIframe(window)) {
    // Use storage over postMessage (or fallback to pym) when we are in an iframe.
    const pmStorage =
      postMessage && createPostMessageStorage(postMessage, type);
    const pymStorage =
      pym && type !== "indexedDB" && createPymStorage(pym, type);
    if (pmStorage || pymStorage) {
      const combined =
        pmStorage &&
        pymStorage &&
        combinePromisifiedStorage(pmStorage, pymStorage);
      return [combined, pmStorage, pymStorage].find((x) =>
        Boolean(x)
      ) as PromisifiedStorage;
    }
  }
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
  staticConfig: StaticConfig | null
): string {
  if (staticConfig && staticConfig.graphQLSubscriptionURI) {
    return staticConfig.graphQLSubscriptionURI;
  }

  let host = location.host;
  if (staticConfig?.tenantDomain) {
    host = staticConfig.tenantDomain;
    if (location.port !== "80" && location.port !== "443") {
      host += `:${location.port}`;
    }
  }

  return `${
    location.protocol === "https:" ? "wss" : "ws"
  }://${host}/api/graphql/live`;
}

interface CreateContextResult {
  context: CoralContext;
  postMessage: PostMessageService;
  localStorage: PromisifiedStorage<string>;
  staticConfig: StaticConfig | null;
  auth: AuthState | null | undefined;
}

export async function createCoralContext({
  localesData,
  pym,
  eventEmitter = new EventEmitter2({ wildcard: true, maxListeners: 1000 }),
  bundle,
  bundleConfig = {},
  tokenRefreshProvider,
}: CreateContextArguments): Promise<CreateContextResult> {
  const postMessage = createPostMessageService(pym);
  const localStorage = resolvedLocalStorage(postMessage, pym);
  const staticConfig = getStaticConfig(window);
  const auth = await retrieveAccessToken(localStorage);

  const browserInfo = getBrowserInfo(window);
  // Load any polyfills that are required.
  await injectConditionalPolyfills(window, browserInfo);

  // Potentially inject react-axe for runtime a11y checks.
  await potentiallyInjectAxe(pym?.parentUrl, browserInfo);

  // Listen for outside clicks.
  let registerClickFarAway: ClickFarAwayRegister | undefined;
  if (pym) {
    registerClickFarAway = (cb) => {
      return onPymMessage(pym, "click", cb);
    };
  }

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
  await polyfillIntlLocale(locales, browserInfo);

  /** clientID is sent to the server with every request */
  const clientID = uuid();

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
    localeBundles,
    tokenRefreshProvider
  );

  // Set new token for the websocket connection.
  // TODO: (cvle) dynamically reset when token changes.
  // ^ only necessary when we can prolong existing session using a new token.
  subscriptionClient.setAccessToken(accessTokenProvider());

  // Assemble context.
  const context: CoralContext = {
    clientID,
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
    sessionStorage: resolveStorage("sessionStorage", postMessage, pym),
    indexedDBStorage: resolveStorage("indexedDB", postMessage, pym),
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
  };

  return {
    context,
    postMessage,
    localStorage,
    staticConfig,
    auth,
  };
}

export function createPostMessageService(pym?: PymChild) {
  const postMessage = new PostMessageService(
    window,
    "coral",
    window.parent,
    pym ? getOrigin(pym.parentUrl) : "*"
  );

  return postMessage;
}

export function resolvedLocalStorage(
  postMessage: PostMessageService,
  pym?: PymChild
) {
  const localStorage = resolveStorage("localStorage", postMessage, pym);

  return localStorage;
}

/**
 * `createManaged` establishes the dependencies of our framework
 * and returns a `ManagedCoralContextProvider` that provides the context
 * to the rest of the application.
 */
export default async function createManaged(
  localesData: LocalesData,
  context: CoralContext,
  createLocalContext?: CreateLocalContextFunc,
  auth?: AuthState | null,
  pym?: PymChild,
  reporterFeedbackPrompt?: boolean
): Promise<ComponentType> {
  const reporter = createReporter(window, { reporterFeedbackPrompt });
  // Set error reporter.
  if (reporter) {
    setGlobalErrorReporter(reporter);
  }

  // Returns a managed CoralContextProvider, that includes the above
  // context and handles context changes, e.g. when a user session changes.
  return await createManagedCoralContextProvider(
    context,
    context.clientID,
    localesData,
    context.localeBundles,
    createLocalContext,
    auth,
    reporter?.ErrorBoundary
  );
}
