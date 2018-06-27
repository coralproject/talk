import React from "react";
import { StatelessComponent } from "react";
import ReactDOM from "react-dom";

import {
  createContext,
  TalkContext,
  TalkContextProvider,
} from "talk-framework/lib/bootstrap";

import { initLocalState } from "./local";
import localesData from "./locales";
import AppQuery from "./queries/AppQuery";

// This is called when the context is first initialized.
async function init({ relayEnvironment }: TalkContext) {
  await initLocalState(relayEnvironment);
}

async function main() {
  // Bootstrap our context.
  const context = await createContext({
    init,
    localesData,
    userLocales: navigator.languages,
  });

  const Index: StatelessComponent = () => (
    <TalkContextProvider value={context}>
      <AppQuery />
    </TalkContextProvider>
  );

  ReactDOM.render(<Index />, document.getElementById("app"));
}

main();
