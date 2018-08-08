import React, { StatelessComponent } from "react";
import ReactDOM from "react-dom";

import {
  createContext,
  TalkContextProvider,
} from "talk-framework/lib/bootstrap";

import AppContainer from "./containers/AppContainer";
import localesData from "./locales";

async function main() {
  // Bootstrap our context.
  const context = await createContext({
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
