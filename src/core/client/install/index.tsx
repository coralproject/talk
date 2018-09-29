import React from "react";
import { StatelessComponent } from "react";
import ReactDOM from "react-dom";

import { createManaged } from "talk-framework/lib/bootstrap";

import AppContainer from "./containers/AppContainer";
import localesData from "./locales";

async function main() {
  const ManagedTalkContextProvider = await createManaged({
    localesData,
    userLocales: navigator.languages,
  });

  const Index: StatelessComponent = () => (
    <ManagedTalkContextProvider>
      <AppContainer />
    </ManagedTalkContextProvider>
  );

  ReactDOM.render(<Index />, document.getElementById("app"));
}

main();
