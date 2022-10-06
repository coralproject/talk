import React, { FunctionComponent } from "react";
import ReactDOM from "react-dom";

import { createManaged } from "coral-framework/lib/bootstrap";

import App from "./App";
import { initLocalState } from "./local";
import localesData from "./locales";

// Import css variables.
import "coral-ui/theme/stream.css";

async function main() {
  const ManagedCoralContextProvider = await createManaged({
    initLocalState,
    localesData,
    bundle: "auth",
  });

  const Index: FunctionComponent = () => (
    <ManagedCoralContextProvider>
      <App />
    </ManagedCoralContextProvider>
  );

  // eslint-disable-next-line no-restricted-globals
  ReactDOM.render(<Index />, document.getElementById("app"));
}

void main();
