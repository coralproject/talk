import { LocalizationProvider } from "fluent-react/compat";
import { FluentBundle } from "fluent/compat";
import { Child as PymChild } from "pym.js";
import React, { StatelessComponent } from "react";
import { MediaQueryMatchers } from "react-responsive";
import { Formatter } from "react-timeago";
import { Environment } from "relay-runtime";

import { PostMessageService } from "talk-framework/lib/postMessage";
import { RestClient } from "talk-framework/lib/rest";
import { PymStorage } from "talk-framework/lib/storage";
import { UIContext } from "talk-ui/components";
import { ClickFarAwayRegister } from "talk-ui/components/ClickOutside";

export interface TalkContext {
  /** relayEnvironment for our relay framework. */
  relayEnvironment: Environment;

  /** localeBundles for our i18n framework. */
  localeBundles: FluentBundle[];

  /** formatter for timeago. */
  timeagoFormatter?: Formatter;

  /** Session Storage */
  localStorage: Storage;

  /** Session storage */
  sessionStorage: Storage;

  /** Session Storage over pym */
  pymLocalStorage?: PymStorage;

  /** Session storage over pym */
  pymSessionStorage?: PymStorage;

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
}

const { Provider, Consumer } = React.createContext<TalkContext>({} as any);

/**
 * Allows consuming the provided context using the React Context API.
 */
export const TalkContextConsumer = Consumer;

/**
 * In addition to just providing the context, TalkContextProvider also
 * renders the `LocalizationProvider` with the appropite data.
 */
export const TalkContextProvider: StatelessComponent<{
  value: TalkContext;
}> = ({ value, children }) => (
  <Provider value={value}>
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
  </Provider>
);
