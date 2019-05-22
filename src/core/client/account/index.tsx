import { createManaged } from "coral-framework/lib/bootstrap";
import React, { FunctionComponent } from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { initLocalState } from "./local";
import localesData from "./locales";

// Import css variables.
import "coral-ui/theme/variables.css";

async function main() {
  const ManagedCoralContextProvider = await createManaged({
    initLocalState,
    localesData,
    userLocales: navigator.languages,
  });

  const Index: FunctionComponent = () => (
    <ManagedCoralContextProvider>
      <App />
    </ManagedCoralContextProvider>
  );

  ReactDOM.render(<Index />, document.getElementById("app"));
}

main();
