import React, { FunctionComponent } from "react";
import ReactDOM from "react-dom";

import { createManaged } from "coral-framework/lib/bootstrap";
import { createCoralContext } from "coral-framework/lib/bootstrap/createManaged";

import App from "./App";
import Head from "./Head";
import { initLocalState } from "./local";
import localesData from "./locales";

// Import css variables.
import "coral-ui/theme/admin.css";

async function main() {
  const contextResult = await createCoralContext({
    initLocalState,
    localesData,
    reporterFeedbackPrompt: true,
    bundle: "admin",
  });

  const ManagedProvider = await createManaged(
    localesData,
    contextResult.context,
    undefined,
    undefined,
    undefined,
    true
  );

  const Index: FunctionComponent = () => (
    <ManagedProvider>
      <Head />
      <App />
    </ManagedProvider>
  );

  // eslint-disable-next-line no-restricted-globals
  ReactDOM.render(<Index />, document.getElementById("app"));
}

void main();
