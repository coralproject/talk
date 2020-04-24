import { Localized } from "@fluent/react/compat";
import { EventEmitter2 } from "eventemitter2";
import { noop } from "lodash";
import { Child as PymChild } from "pym.js";
import React, { Component, ComponentType } from "react";
import { Formatter } from "react-timeago";
import { Environment, RecordSource, Store } from "relay-runtime";
import { v1 as uuid } from "uuid";

import { LanguageCode } from "coral-common/helpers/i18n";
import { getBrowserInfo } from "coral-framework/lib/browserInfo";
import { RestClient } from "coral-framework/lib/rest";
import {
  createLocalStorage,
  createPromisifiedStorage,
  createPymStorage,
  createSessionStorage,
  PromisifiedStorage,
} from "coral-framework/lib/storage";
import { ClickFarAwayRegister } from "coral-ui/components/ClickOutside";

import Auth from "../auth";
import { generateBundles, LocalesData } from "../i18n";
import {
  createManagedSubscriptionClient,
  createNetwork,
  ManagedSubscriptionClient,
} from "../network";
import { PostMessageService } from "../postMessage";
import { syncAuthWithLocalState } from "../relay/localState";
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

  /** Access token that should be used instead of what's currently in storage */
  accessToken?: string;

  /** A pym child that interacts with the pym parent. */
  pym?: PymChild;

  /** Supports emitting and listening to events. */
  eventEmitter?: EventEmitter2;
}

/** websocketURL points to our live graphql server */
const websocketURL = `${location.protocol === "https:" ? "wss" : "ws"}://${
  location.host
}/api/graphql/live`;

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
  auth: Auth,
  clientID: string
) {
  return new Environment({
    network: createNetwork(subscriptionClient, auth.getAccessToken, clientID),
    store: new Store(new RecordSource()),
  });
}

function createRestClient(auth: Auth, clientID: string) {
  return new RestClient("/api", auth.getAccessToken, clientID);
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
      // Pause subscriptions.
      subscriptionClient.pause();

      // Call all functions to cleanup.
      this.state.context.cleanupCallbacks.forEach((cb) => cb());

      // Update the token.
      this.state.context.auth.set(nextAccessToken);

      // Create the new environment.
      const environment = createRelayEnvironment(
        subscriptionClient,
        this.state.context.auth,
        clientID
      );

      // Reset the cleanup callbacks.
      this.state.context.cleanupCallbacks = [];

      // Create the new context.
      const newContext: CoralContext = {
        ...this.state.context,
        relayEnvironment: environment,
        rest: createRestClient(this.state.context.auth, clientID),
      };

      // Initialize local state.
      await initLocalState(newContext.relayEnvironment, newContext);

      // Configure the syncing of the relay environment with the auth changes.
      this.state.context.cleanupCallbacks.push(
        syncAuthWithLocalState(environment, this.state.context.auth)
      );

      // Update the token.
      this.state.context.auth.set(nextAccessToken);

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
    registerClickFarAway = (cb) => {
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

  // Setup the auth manager backed on localStorage.
  const auth = new Auth(localStorage);

  /** clientID is sent to the server with every request */
  const clientID = uuid();

  const subscriptionClient = createManagedSubscriptionClient(
    websocketURL,
    auth,
    clientID
  );

  const environment = createRelayEnvironment(
    subscriptionClient,
    auth,
    clientID
  );

  // Assemble context.
  const context: CoralContext = {
    auth,
    relayEnvironment: environment,
    locales,
    localeBundles,
    timeagoFormatter,
    pym,
    eventEmitter,
    registerClickFarAway,
    rest: createRestClient(auth, clientID),
    postMessage: new PostMessageService(),
    localStorage: resolveLocalStorage(pym),
    sessionStorage: resolveSessionStorage(pym),
    browserInfo: getBrowserInfo(),
    uuidGenerator: uuid,
    // Noop, this is later replaced by the
    // managed CoralContextProvider.
    clearSession: (nextAccessToken?: string | null) => Promise.resolve(),
    cleanupCallbacks: [],
    // Noop, this is later replaced by the
    // managed CoralContextProvider.
    changeLocale: (locale?: LanguageCode) => Promise.resolve(),
  };

  // Initialize local state.
  await initLocalState(context.relayEnvironment, context);

  // Configure the syncing of the relay environment with the auth changes.
  context.cleanupCallbacks.push(syncAuthWithLocalState(environment, auth));

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
