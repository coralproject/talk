import { FluentBundle } from "@fluent/bundle/compat";
import { LocalizationProvider, ReactLocalization } from "@fluent/react/compat";
import { EventEmitter2 } from "eventemitter2";
import React, { FunctionComponent } from "react";
import { MediaQueryMatchers } from "react-responsive";
import { Formatter } from "react-timeago";
import { Environment } from "relay-runtime";

import { LanguageCode } from "coral-common/helpers/i18n";
import { BrowserInfo } from "coral-framework/lib/browserInfo";
import { PostMessageService } from "coral-framework/lib/postMessage";
import { RestClient } from "coral-framework/lib/rest";
import { PromisifiedStorage } from "coral-framework/lib/storage";
import { TransitionControlData } from "coral-framework/testHelpers";
import { UIContext } from "coral-ui/components/v2";

import { ManagedSubscriptionClient } from "../network/createManagedSubscriptionClient";
import { TokenRefreshProvider } from "../network/tokenRefreshProvider";
import { InMemoryStorage } from "../storage/InMemoryStorage";

export interface CoralContext {
  /** relayEnvironment for our relay framework. */
  relayEnvironment: Environment;

  /** subscriptionClient that managed the websocket connection for subscriptions */
  subscriptionClient: ManagedSubscriptionClient;

  /** locales */
  locales: string[];

  /** localeBundles for our i18n framework. */
  localeBundles: FluentBundle[];

  /** formatter for timeago. */
  timeagoFormatter?: Formatter;

  /** inMemory Storage */
  inMemoryStorage: InMemoryStorage;

  /**
   * This is the window, where the React code is running.
   * Usually this is same as the global `window` object.
   */
  window: Window;

  /**
   * This is the window, we are rendering to,
   * this is different from `window` above, when we
   * are rendering to another frame.
   */
  renderWindow: Window;

  /** Local Storage */
  localStorage: PromisifiedStorage;

  /** Session storage */
  sessionStorage: PromisifiedStorage;

  /** IndexedDB storage */
  indexedDBStorage: PromisifiedStorage<any>;

  /** media query values for testing purposes */
  mediaQueryValues?: MediaQueryMatchers;

  /** Rest Client */
  rest: RestClient;

  /** postMessage service */
  postMessage: PostMessageService;

  /** Browser detection. */
  browserInfo: BrowserInfo;

  /** Generates uuids. */
  uuidGenerator: () => string;

  /** A event emitter */
  eventEmitter: EventEmitter2;

  /** TokenRefreshProvider is used to obtain a new access token after expiry */
  tokenRefreshProvider: TokenRefreshProvider;

  /** Clear session data. */
  clearSession: (
    nextAccessToken?: string | null,
    options?: { ephemeral?: boolean }
  ) => Promise<void>;

  /** Change locale and rerender */
  changeLocale: (locale: LanguageCode) => Promise<void>;

  /** Controls router transitions (for tests) */
  transitionControl?: TransitionControlData;

  /** rootURL to the Coral Server */
  rootURL: string;

  /** Supports a custom scroll container element if Coral is rendered outside
   * of the render window
   */
  customScrollContainer?: HTMLElement;
}

export const CoralReactContext = React.createContext<CoralContext>({} as any);

export const useCoralContext = () => React.useContext(CoralReactContext);

/**
 * Allows consuming the provided context using the React Context API.
 */
export const CoralContextConsumer = CoralReactContext.Consumer;

export function getUIContextPropsFromCoralContext(ctx: CoralContext) {
  return {
    timeagoFormatter: ctx.timeagoFormatter,
    mediaQueryValues: ctx.mediaQueryValues,
    locales: ctx.locales,
    renderWindow: ctx.renderWindow,
  };
}

/**
 * In addition to just providing the context, CoralContextProvider also
 * renders the `LocalizationProvider` with the appropriate data.
 */
export const CoralContextProvider: FunctionComponent<{
  value: CoralContext;
  children?: React.ReactNode;
}> = ({ value, children }) => {
  const l10n = new ReactLocalization(value.localeBundles);
  return (
    <CoralReactContext.Provider value={value}>
      <LocalizationProvider l10n={l10n}>
        <UIContext.Provider value={getUIContextPropsFromCoralContext(value)}>
          {children}
        </UIContext.Provider>
      </LocalizationProvider>
    </CoralReactContext.Provider>
  );
};
