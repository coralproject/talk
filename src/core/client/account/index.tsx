import React, { FunctionComponent } from "react";
import ReactDOM from "react-dom";
import { createManaged } from "talk-framework/lib/bootstrap";

import App from "./App";
import { initLocalState } from "./local";
import localesData from "./locales";

// Import css variables.
import "talk-ui/theme/variables.css";

async function main() {
  const ManagedTalkContextProvider = await createManaged({
    initLocalState,
    localesData,
    userLocales: navigator.languages,
  });

  const Index: FunctionComponent = () => (
    <ManagedTalkContextProvider>
      <App />
    </ManagedTalkContextProvider>
  );

  ReactDOM.render(<Index />, document.getElementById("app"));
}

main();
