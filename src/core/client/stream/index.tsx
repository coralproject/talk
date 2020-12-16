import { Child as PymChild } from "pym.js";
import React, { FunctionComponent } from "react";
import ReactDOM from "react-dom";

import { parseQuery } from "coral-common/utils";
import { createManaged } from "coral-framework/lib/bootstrap";
import { createTokenRefreshProvider } from "coral-framework/lib/network/tokenRefreshProvider";

import AppContainer from "./App";
import { initLocalState } from "./local";
import localesData from "./locales";

// Import css variables.
import "coral-ui/theme/stream.css";

function extractBundleConfig() {
  const { storyID, storyURL } = parseQuery(location.search);
  return { storyID, storyURL } as Record<string, string>;
}

async function main() {
  const pym = new PymChild({
    polling: 100,
  });

  // Detect and extract the storyID and storyURL from the current page so we can
  // add it to the managed provider.
  const bundleConfig = extractBundleConfig();

  const ManagedCoralContextProvider = await createManaged({
    initLocalState,
    localesData,
    pym,
    bundle: "stream",
    bundleConfig,
    tokenRefreshProvider: createTokenRefreshProvider(),
  });

  const Index: FunctionComponent = () => (
    <ManagedCoralContextProvider>
      <AppContainer />
    </ManagedCoralContextProvider>
  );

  ReactDOM.render(<Index />, document.getElementById("app"));
}

void main();
