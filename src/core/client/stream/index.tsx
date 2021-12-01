/* eslint-disable no-restricted-globals */
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
  const { renderTarget } = parseQuery(location.search);
  if (renderTarget) {
    // TODO: (cvle) iframeless
    throw new Error("Render targets not supported.");
  }

  // Detect and extract the storyID and storyURL from the current page so we can
  // add it to the managed provider.
  const bundleConfig = extractBundleConfig();

  const ManagedCoralContextProvider = await createManaged({
    initLocalState,
    localesData,
    bundle: "stream",
    bundleConfig,
    tokenRefreshProvider: createTokenRefreshProvider(),
  });

  const Index: FunctionComponent = () => (
    <ManagedCoralContextProvider>
      <AppContainer />
    </ManagedCoralContextProvider>
  );

  // eslint-disable-next-line no-restricted-globals
  ReactDOM.render(<Index />, window.document.getElementById("app"));
}

void main();
