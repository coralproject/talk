import { Child as PymChild } from "pym.js";
import React, { FunctionComponent } from "react";
import ReactDOM from "react-dom";

import injectConditionalPolyfills from "coral-framework/helpers/injectConditionalPolyfills";
import potentiallyInjectAxe from "coral-framework/helpers/potentiallyInjectAxe";
import { createManaged } from "coral-framework/lib/bootstrap";

import AppContainer from "./App";
import { initLocalState } from "./local";
import localesData from "./locales";

// Import css variables.
import "coral-ui/theme/variables.css";

async function main() {
  const pym = new PymChild({
    polling: 100,
  });
  await injectConditionalPolyfills();
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
}

main();
