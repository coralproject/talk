import React, { FunctionComponent } from "react";
import { createRoot } from "react-dom/client";

import { createManaged } from "coral-framework/lib/bootstrap";

import App from "./App";
import Head from "./Head";
import { initLocalState } from "./local";
import localesData from "./locales";

// Import css variables.
import "coral-ui/theme/admin.css";

async function main() {
  const ManagedCoralContextProvider = await createManaged({
    initLocalState,
    localesData,
    reporterFeedbackPrompt: true,
    bundle: "admin",
  });

  const Index: FunctionComponent = () => (
    <ManagedCoralContextProvider>
      <Head />
      <App />
    </ManagedCoralContextProvider>
  );

  // eslint-disable-next-line no-restricted-globals
  const container = document.getElementById("app");
  const root = createRoot(container!);

  root.render(<Index />);
}

void main();
