import React, { StatelessComponent } from "react";
import ReactDOM from "react-dom";

import {
  createContext,
  TalkContext,
  TalkContextProvider,
} from "talk-framework/lib/bootstrap";

import AppContainer from "./containers/AppContainer";
import { initLocalState } from "./local";
import localesData from "./locales";

// This is called when the context is first initialized.
async function init(context: TalkContext) {
  await initLocalState(context.relayEnvironment);
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
      <AppContainer />
    </TalkContextProvider>
  );

  ReactDOM.render(<Index />, document.getElementById("app"));
}

main();
