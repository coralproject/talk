import React, { FunctionComponent } from "react";
import ReactDOM from "react-dom";

import injectConditionalPolyfills from "coral-framework/helpers/injectConditionalPolyfills";
import potentiallyInjectAxe from "coral-framework/helpers/potentiallyInjectAxe";
import { createManaged } from "coral-framework/lib/bootstrap";
import { createReporter } from "coral-framework/lib/errors/reporter";

import App from "./App";
import { initLocalState } from "./local";
import localesData from "./locales";

// Import css variables.
import "coral-ui/theme/stream.css";

async function main() {
  // Configure and load the error reporter.
  const reporter = createReporter();

  await injectConditionalPolyfills();

  // Potentially inject react-axe for runtime a11y checks.
  await potentiallyInjectAxe();

  const ManagedCoralContextProvider = await createManaged({
    initLocalState,
    localesData,
    reporter,
  });

  const Index: FunctionComponent = () => (
    <ManagedCoralContextProvider>
      <App />
    </ManagedCoralContextProvider>
  );

  ReactDOM.render(<Index />, document.getElementById("app"));
}

void main();
