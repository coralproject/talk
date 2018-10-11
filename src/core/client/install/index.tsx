import React from "react";
import { StatelessComponent } from "react";
import ReactDOM from "react-dom";

import { createManaged } from "talk-framework/lib/bootstrap";

import App from "./components/App";
import localesData from "./locales";

async function main() {
  const ManagedTalkContextProvider = await createManaged({
    localesData,
    userLocales: navigator.languages,
  });

  const Index: StatelessComponent = () => (
    <ManagedTalkContextProvider>
      <App />
    </ManagedTalkContextProvider>
  );

  ReactDOM.render(<Index />, document.getElementById("app"));
}

main();
