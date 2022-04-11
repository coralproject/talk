/* eslint-disable no-restricted-globals */
import { Child as PymChild } from "pym.js";
import React, { FunctionComponent } from "react";
import ReactDOM from "react-dom";

import { parseQuery } from "coral-common/utils";
import { injectConditionalPolyfills } from "coral-framework/helpers";
import { createManaged } from "coral-framework/lib/bootstrap";
import { getBrowserInfo } from "coral-framework/lib/browserInfo";
import { getExternalConfig } from "coral-framework/lib/externalConfig";
import { createTokenRefreshProvider } from "coral-framework/lib/network/tokenRefreshProvider";

import AppContainer from "./App";
import { initLocalState } from "./local";
import StreamLocal from "./local/StreamLocal";
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
    // Load any polyfills that are required.
    await injectConditionalPolyfills(window, getBrowserInfo(window));
    window.document.body.style.background = "transparent";
    return;
  }
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

  const config = await getExternalConfig(window, pym);

  const Index: FunctionComponent = () => (
    <ManagedCoralContextProvider>
      <StreamLocal config={config}>
        <AppContainer />
      </StreamLocal>
    </ManagedCoralContextProvider>
  );

  // eslint-disable-next-line no-restricted-globals
  ReactDOM.render(<Index />, window.document.getElementById("app"));
}

void main();
