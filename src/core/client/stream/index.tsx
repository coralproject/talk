import { Child as PymChild } from "pym.js";
import React, { FunctionComponent } from "react";
import ReactDOM from "react-dom";

import potentiallyInjectAxe from "coral-framework/helpers/potentiallyInjectAxe";
import { createManaged } from "coral-framework/lib/bootstrap";

import AppContainer from "./App";
import { initLocalState } from "./local";
import localesData from "./locales";

const cssVars = require("css-vars-ponyfill").default;

// Import css variables.
import "coral-ui/theme/variables.css";

async function main() {
  const pym = new PymChild({
    polling: 100,
  });
  // Potentially inject react-axe for runtime a11y checks.
  await potentiallyInjectAxe(pym.parentUrl);
  const ManagedCoralContextProvider = await createManaged({
    initLocalState,
    localesData,
    pym,
  });

  const Index: FunctionComponent = () => (
    <ManagedCoralContextProvider>
      <AppContainer />
    </ManagedCoralContextProvider>
  );

  ReactDOM.render(<Index />, document.getElementById("app"));
  cssVars();
}

main();
