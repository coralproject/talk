import { EventEmitter2 } from "eventemitter2";
import { LocalizationProvider } from "fluent-react/compat";
import { FluentBundle } from "fluent/compat";
import { Child as PymChild } from "pym.js";
import React, { StatelessComponent } from "react";
import { MediaQueryMatchers } from "react-responsive";
import { Formatter } from "react-timeago";
import { Environment } from "relay-runtime";

import { BrowserInfo } from "talk-framework/lib/browserInfo";
import { PostMessageService } from "talk-framework/lib/postMessage";
import { RestClient } from "talk-framework/lib/rest";
import { PromisifiedStorage } from "talk-framework/lib/storage";
import { UIContext } from "talk-ui/components";
import { ClickFarAwayRegister } from "talk-ui/components/ClickOutside";

export interface TalkContext {
  /** relayEnvironment for our relay framework. */
  relayEnvironment: Environment;

  /** locales */
  locales: string[];

  /** localeBundles for our i18n framework. */
  localeBundles: FluentBundle[];

  /** formatter for timeago. */
  timeagoFormatter?: Formatter;

  /** Local Storage */
  localStorage: PromisifiedStorage;

  /** Session storage */
  sessionStorage: PromisifiedStorage;

  /** media query values for testing purposes */
  mediaQueryValues?: MediaQueryMatchers;

  /** Rest client */
  rest: RestClient;

  /** postMessage service */
  postMessage: PostMessageService;

  /**
   * A way to listen for clicks that are e.g. outside of the
   * current frame for `ClickOutside`
   */
  registerClickFarAway?: ClickFarAwayRegister;

  /** A pym child that interacts with the pym parent. */
  pym?: PymChild;

  /** Browser detection. */
  browserInfo: BrowserInfo;

  /** Generates uuids. */
  uuidGenerator: () => string;

  /** A event emitter */
  eventEmitter: EventEmitter2;

  /** Clear session data. */
  clearSession: () => Promise<void>;
}

export const TalkReactContext = React.createContext<TalkContext>({} as any);

export const useTalkContext = () => React.useContext(TalkReactContext);

/**
 * Allows consuming the provided context using the React Context API.
 */
export const TalkContextConsumer = TalkReactContext.Consumer;

/**
 * In addition to just providing the context, TalkContextProvider also
 * renders the `LocalizationProvider` with the appropite data.
 */
export const TalkContextProvider: StatelessComponent<{
  value: TalkContext;
}> = ({ value, children }) => (
  <TalkReactContext.Provider value={value}>
    <LocalizationProvider bundles={value.localeBundles}>
      <UIContext.Provider
        value={{
          timeagoFormatter: value.timeagoFormatter,
          registerClickFarAway: value.registerClickFarAway,
          mediaQueryValues: value.mediaQueryValues,
        }}
      >
        {children}
      </UIContext.Provider>
    </LocalizationProvider>
  </TalkReactContext.Provider>
);
