import { LocalizationProvider } from "fluent-react/compat";
import { MessageContext } from "fluent/compat";
import { Child as PymChild } from "pym.js";
import React, { StatelessComponent } from "react";
import { Formatter } from "react-timeago";
import { Environment } from "relay-runtime";

import { UIContext } from "talk-ui/components";

export interface TalkContext {
  /** relayEnvironment for our relay framework. */
  relayEnvironment: Environment;

  /** localMessages for our i18n framework. */
  localeMessages: MessageContext[];

  /** formatter for timeago. */
  timeagoFormatter?: Formatter;

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
    <LocalizationProvider messages={value.localeMessages}>
      <UIContext.Provider value={{ timeagoFormatter: value.timeagoFormatter }}>
        {children}
      </UIContext.Provider>
    </LocalizationProvider>
  </Provider>
);
