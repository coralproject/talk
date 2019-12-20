import { Localized } from "@fluent/react/compat";
import { EventEmitter2 } from "eventemitter2";
import { noop } from "lodash";
import { Child as PymChild } from "pym.js";
import React, { Component, ComponentType } from "react";
import { Formatter } from "react-timeago";
import { Environment, RecordSource, Store } from "relay-runtime";
import uuid from "uuid/v1";

import { LanguageCode } from "coral-common/helpers/i18n";
import { getBrowserInfo } from "coral-framework/lib/browserInfo";
import {
  commitLocalUpdatePromisified,
  LOCAL_ID,
  setAccessTokenInLocalState,
} from "coral-framework/lib/relay";
import { RestClient } from "coral-framework/lib/rest";
import {
  createLocalStorage,
  createPromisifiedStorage,
  createPymStorage,
  createSessionStorage,
  PromisifiedStorage,
} from "coral-framework/lib/storage";
import { ClickFarAwayRegister } from "coral-ui/components/ClickOutside";

import { generateBundles, LocalesData } from "../i18n";
import {
  createManagedSubscriptionClient,
  createNetwork,
  ManagedSubscriptionClient,
  TokenGetter,
} from "../network";
import { PostMessageService } from "../postMessage";
import { CoralContext, CoralContextProvider } from "./CoralContext";
import SendPymReady from "./SendPymReady";

export type InitLocalState = (
  environment: Environment,
  context: CoralContext
) => void | Promise<void>;

interface CreateContextArguments {
  /** Locales data that is returned by our `locales-loader`. */
  localesData: LocalesData;

  /** Init will be called after the context has been created. */
  initLocalState?: InitLocalState;

  /** A pym child that interacts with the pym parent. */
  pym?: PymChild;

  /** Supports emitting and listening to events. */
  eventEmitter?: EventEmitter2;
}

/** websocketURL points to our live graphql server */
const websocketURL = `${location.protocol === "https:" ? "wss" : "ws"}://${
  location.hostname
}:${location.port}/api/graphql/live`;

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
  clientID: string
) {
  const source = new RecordSource();
  const tokenGetter: TokenGetter = () => {
    const localState = source.get(LOCAL_ID);
    if (localState) {
      return localState.accessToken || "";
    }
    return "";
  };
  const environment = new Environment({
    network: createNetwork(subscriptionClient, tokenGetter, clientID),
    store: new Store(source),
  });
  return { environment, tokenGetter, subscriptionClient };
}

function createRestClient(tokenGetter: () => string, clientID: string) {
  return new RestClient("/api", tokenGetter, clientID);
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
  localesData: LocalesData
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
    private clearSession = async (nextAccessToken?: string | null) => {
      // Clear session storage.
      this.state.context.sessionStorage.clear();

      // Pause subscriptions.
      subscriptionClient.pause();

      // Create a new context with a new Relay Environment.
      const {
        environment: newEnvironment,
        tokenGetter: newTokenGetter,
      } = createRelayEnvironment(subscriptionClient, clientID);

      const newContext = {
        ...this.state.context,
        relayEnvironment: newEnvironment,
        rest: createRestClient(newTokenGetter, clientID),
      };

      // Initialize local state.
      await initLocalState(newContext.relayEnvironment, newContext);

      // Set new token for the websocket connection.
      // TODO: (cvle) dynamically reset when token changes.
      // ^ only necessary when we can prolong existing session using
      // a new token.
      subscriptionClient.setAccessToken(newTokenGetter());

      // Set next access token.
      if (nextAccessToken) {
        await commitLocalUpdatePromisified(newEnvironment, async store => {
          setAccessTokenInLocalState(nextAccessToken, store);
        });
      }

      // Propagate new context.
      this.setState(
        {
          context: newContext,
        },
        () => {
          // Resume subscriptions after context has changed.
          subscriptionClient.resume();
        }
      );
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
      return (
        <CoralContextProvider value={this.state.context}>
          {this.props.children}
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
function resolveLocalStorage(pym?: PymChild): PromisifiedStorage {
  if (pym && areWeInIframe()) {
    // Use local storage over pym when we have pym and are in an iframe.
    return createPymStorage(pym, "localStorage");
  }
  // Use promisified, prefixed local storage.
  return createPromisifiedStorage(createLocalStorage());
}

/**
 * resolveSessionStorage decides which session storage to use in the context
 */
function resolveSessionStorage(pym?: PymChild): PromisifiedStorage {
  if (pym && areWeInIframe()) {
    // Use session storage over pym when we have pym and are in an iframe.
    return createPymStorage(pym, "sessionStorage");
  }
  // Use promisified, prefixed session storage.
  return createPromisifiedStorage(createSessionStorage());
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
}: CreateContextArguments): Promise<ComponentType> {
  // Listen for outside clicks.
  let registerClickFarAway: ClickFarAwayRegister | undefined;
  if (pym) {
    registerClickFarAway = cb => {
      pym.onMessage("click", cb);
      // Return unlisten callback.
      return () => {
        const index = pym.messageHandlers.click.indexOf(cb);
        if (index > -1) {
          pym.messageHandlers.click.splice(index, 1);
        }
      };
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
    console.log(`Using locales ${JSON.stringify(locales)}`);
  }

  const localeBundles = await generateBundles(locales, localesData);

  const localStorage = resolveLocalStorage(pym);
  const sessionStorage = resolveSessionStorage(pym);

  /** clientID is sent to the server with every request */
  const clientID = uuid();

  const subscriptionClient = createManagedSubscriptionClient(
    websocketURL,
    clientID
  );

  const { environment, tokenGetter } = createRelayEnvironment(
    subscriptionClient,
    clientID
  );

  // Assemble context.
  const context: CoralContext = {
    relayEnvironment: environment,
    locales,
    localeBundles,
    timeagoFormatter,
    pym,
    eventEmitter,
    registerClickFarAway,
    rest: createRestClient(tokenGetter, clientID),
    postMessage: new PostMessageService(),
    localStorage,
    sessionStorage,
    browserInfo: getBrowserInfo(),
    uuidGenerator: uuid,
    // Noop, this is later replaced by the
    // managed CoralContextProvider.
    clearSession: (nextAccessToken?: string | null) => Promise.resolve(),
    // Noop, this is later replaced by the
    // managed CoralContextProvider.
    changeLocale: (locale?: LanguageCode) => Promise.resolve(),
  };

  // Initialize local state.
  await initLocalState(context.relayEnvironment, context);

  // Set current token for the websocket connection.
  // TODO: (cvle) dynamically reset when token changes.
  // ^ only necessary when we can prolong existing session using
  // a new token.
  subscriptionClient.setAccessToken(tokenGetter());

  // Returns a managed CoralContextProvider, that includes the above
  // context and handles context changes, e.g. when a user session changes.
  return createManagedCoralContextProvider(
    context,
    subscriptionClient,
    clientID,
    initLocalState,
    localesData
  );
}
