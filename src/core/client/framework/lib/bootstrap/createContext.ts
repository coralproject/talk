import { noop } from "lodash";
import { Environment, Network, RecordSource, Store } from "relay-runtime";

import { generateMessages, LocalesData, negotiateLanguages } from "../i18n";
import { fetchQuery } from "../network";
import { TalkContext } from "./TalkContext";

interface CreateContextArguments {
  // Locales that the user accepts, usually `navigator.languages`.
  userLocales: ReadonlyArray<string>;

  // Locales data that is returned by our `locales-loader`.
  localesData: LocalesData;

  // Init will be called after the context has been created.
  init?: ((context: TalkContext) => void | Promise<void>);
}

/**
 * `createContext` manages the dependencies of our framework
 * and returns a `TalkContext` that can be passed to the
 * `TalkContextProvider`.
 */
export default async function createContext({
  init = noop,
  userLocales,
  localesData,
}: CreateContextArguments): Promise<TalkContext> {
  // Initialize Relay.
  const relayEnvironment = new Environment({
    network: Network.create(fetchQuery),
    store: new Store(new RecordSource()),
  });

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
  };

  // Run custom initializations.
  await init(context);

  return context;
}
