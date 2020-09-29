import { Child as PymChild } from "pym.js";
import React, { FunctionComponent } from "react";
import ReactDOM from "react-dom";

import { parseQuery } from "coral-common/utils";
import injectConditionalPolyfills from "coral-framework/helpers/injectConditionalPolyfills";
import potentiallyInjectAxe from "coral-framework/helpers/potentiallyInjectAxe";
import { createManaged } from "coral-framework/lib/bootstrap";
import { createReporter } from "coral-framework/lib/errors/reporter";
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
  // Configure and load the error reporter.
  const reporter = createReporter();

  const pym = new PymChild({
    polling: 100,
  });

  await injectConditionalPolyfills();

  // Potentially inject react-axe for runtime a11y checks.
  await potentiallyInjectAxe(pym.parentUrl);

  // Detect and extract the storyID and storyURL from the current page so we can
  // add it to the managed provider.
  const bundleConfig = extractBundleConfig();

  const ManagedCoralContextProvider = await createManaged({
    initLocalState,
    localesData,
    pym,
    reporter,
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
