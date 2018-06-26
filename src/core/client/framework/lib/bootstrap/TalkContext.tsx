import { LocalizationProvider } from "fluent-react/compat";
import { MessageContext } from "fluent/compat";
import React, { StatelessComponent } from "react";
import { Environment } from "relay-runtime";

export interface TalkContext {
  // relayEnvironment for our relay framework.
  relayEnvironment: Environment;

  // localMessages for our i18n framework.
  localeMessages: MessageContext[];
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
      {children}
    </LocalizationProvider>
  </Provider>
);
