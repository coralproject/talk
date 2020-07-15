import React, { FunctionComponent } from "react";
import ReactDOM from "react-dom";

import injectConditionalPolyfills from "coral-framework/helpers/injectConditionalPolyfills";
import potentiallyInjectAxe from "coral-framework/helpers/potentiallyInjectAxe";
import { createManaged } from "coral-framework/lib/bootstrap";

import App from "./App";
import Head from "./Head";
import { initLocalState } from "./local";
import localesData from "./locales";

// Import css variables.
import "coral-ui/theme/admin.css";

async function main() {
  await injectConditionalPolyfills();
  // Potentially inject react-axe for runtime a11y checks.
  await potentiallyInjectAxe();
  const ManagedCoralContextProvider = await createManaged({
    initLocalState,
    localesData,
  });

  const Index: FunctionComponent = () => (
    <ManagedCoralContextProvider>
      <Head />
      <App />
    </ManagedCoralContextProvider>
  );

  ReactDOM.render(<Index />, document.getElementById("app"));
}

void main();
