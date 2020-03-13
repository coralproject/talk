import { FluentBundle } from "@fluent/bundle/compat";
import { LocalizationProvider } from "@fluent/react/compat";
import { EventEmitter2 } from "eventemitter2";
import { Child as PymChild } from "pym.js";
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
import { ClickFarAwayRegister } from "coral-ui/components/ClickOutside";
import { UIContext } from "coral-ui/components/v2";

export interface CoralContext {
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

  /** Rest Client */
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
  clearSession: (nextAccessToken?: string | null) => Promise<void>;

  /** Change locale and rerender */
  changeLocale: (locale: LanguageCode) => Promise<void>;

  /** Controls router transitions (for tests) */
  transitionControl?: TransitionControlData;
}

export const CoralReactContext = React.createContext<CoralContext>({} as any);

export const useCoralContext = () => React.useContext(CoralReactContext);

/**
 * Allows consuming the provided context using the React Context API.
 */
export const CoralContextConsumer = CoralReactContext.Consumer;

const parser = new DOMParser();

// Use this custom markup parser which works in IE11.
function parseMarkup(str: string) {
  const doc = parser.parseFromString(`<body>${str}</body>`, "text/html");
  return Array.from(doc.body.childNodes);
}
/**
 * In addition to just providing the context, CoralContextProvider also
 * renders the `LocalizationProvider` with the appropite data.
 */
export const CoralContextProvider: FunctionComponent<{
  value: CoralContext;
}> = ({ value, children }) => (
  <CoralReactContext.Provider value={value}>
    <LocalizationProvider
      bundles={value.localeBundles}
      parseMarkup={parseMarkup}
    >
      <UIContext.Provider
        value={{
          timeagoFormatter: value.timeagoFormatter,
          registerClickFarAway: value.registerClickFarAway,
          mediaQueryValues: value.mediaQueryValues,
          locales: value.locales,
        }}
      >
        {children}
      </UIContext.Provider>
    </LocalizationProvider>
  </CoralReactContext.Provider>
);
