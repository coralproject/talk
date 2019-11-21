import React, { FunctionComponent } from "react";
import ReactDOM from "react-dom";

import potentiallyInjectAxe from "coral-framework/helpers/potentiallyInjectAxe";
import { createManaged } from "coral-framework/lib/bootstrap";

import App from "./App";
import { initLocalState } from "./local";
import localesData from "./locales";

// Import css variables.
import "coral-ui/theme/variables.css";

async function main() {
  // Potentially inject react-axe for runtime a11y checks.
  await potentiallyInjectAxe();
  const ManagedCoralContextProvider = await createManaged({
    localesData,
    initLocalState,
  });

  const Index: FunctionComponent = () => (
    <ManagedCoralContextProvider>
      <App />
    </ManagedCoralContextProvider>
  );

  ReactDOM.render(<Index />, document.getElementById("app"));
}

main();
