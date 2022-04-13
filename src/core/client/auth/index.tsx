import React, { FunctionComponent } from "react";
import ReactDOM from "react-dom";

import { createManaged } from "coral-framework/lib/bootstrap";
import { createCoralContext } from "coral-framework/lib/bootstrap/createManaged";

import App from "./App";
import { initLocalState } from "./local";
import localesData from "./locales";

// Import css variables.
import "coral-ui/theme/stream.css";

async function main() {
  const contextResult = await createCoralContext({
    initLocalState,
    localesData,
    bundle: "auth",
  });

  const ManagedProvider = await createManaged(
    localesData,
    contextResult.context
  );

  const Index: FunctionComponent = () => (
    <ManagedProvider>
      <App />
    </ManagedProvider>
  );

  // eslint-disable-next-line no-restricted-globals
  ReactDOM.render(<Index />, document.getElementById("app"));
}

void main();
