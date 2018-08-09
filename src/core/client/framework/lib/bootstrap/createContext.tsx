import { EventEmitter2 } from "eventemitter2";
import { Localized } from "fluent-react/compat";
import { noop } from "lodash";
import { Child as PymChild } from "pym.js";
import React from "react";
import { Formatter } from "react-timeago";
import { Environment, Network, RecordSource, Store } from "relay-runtime";
import { LOCAL_ID } from "talk-framework/lib/relay";
import {
  createLocalStorage,
  createSessionStorage,
} from "talk-framework/lib/storage";

import { ClickFarAwayRegister } from "talk-ui/components/ClickOutside";

import { generateMessages, LocalesData, negotiateLanguages } from "../i18n";
import { createFetch, TokenGetter } from "../network";
import { TalkContext } from "./TalkContext";

interface CreateContextArguments {
  /** Locales that the user accepts, usually `navigator.languages`. */
  userLocales: ReadonlyArray<string>;

  /** Locales data that is returned by our `locales-loader`. */
  localesData: LocalesData;

  /** Init will be called after the context has been created. */
  init?: ((context: TalkContext) => void | Promise<void>);

  /** A pym child that interacts with the pym parent. */
  pym?: PymChild;

  /** Supports emitting and listening to events. */
  eventEmitter?: EventEmitter2;
}

/**
 * timeagoFormatter integrates timeago into our translation
 * framework. It gets injected into the UIContext.
 */
export const timeagoFormatter: Formatter = (value, unit, suffix) => {
  // We use 'in' instead of 'from now' for language consistency
  const ourSuffix = suffix === "from now" ? "in" : suffix;
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
 * `createContext` manages the dependencies of our framework
 * and returns a `TalkContext` that can be passed to the
 * `TalkContextProvider`.
 */
export default async function createContext({
  init = noop,
  userLocales,
  localesData,
  pym,
  eventEmitter = new EventEmitter2({ wildcard: true }),
}: CreateContextArguments): Promise<TalkContext> {
  // Initialize Relay.
  const source = new RecordSource();
  const tokenGetter: TokenGetter = () => {
    const localState = source.get(LOCAL_ID);
    if (localState) {
      return localState.authToken || "";
    }
    return "";
  };
  const relayEnvironment = new Environment({
    network: Network.create(createFetch(tokenGetter)),
    store: new Store(source),
  });

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
  const locales = negotiateLanguages(userLocales, localesData);

  if (process.env.NODE_ENV !== "production") {
    // tslint:disable:next-line: no-console
    console.log(`Negotiated locales ${JSON.stringify(locales)}`);
  }

  const localeMessages = await generateMessages(locales, localesData);

  // Assemble context.
  const context = {
    relayEnvironment,
    localeMessages,
    timeagoFormatter,
    pym,
    eventEmitter,
    registerClickFarAway,
    localStorage: createLocalStorage(),
    sessionStorage: createSessionStorage(),
  };

  // Run custom initializations.
  await init(context);

  return context;
}
