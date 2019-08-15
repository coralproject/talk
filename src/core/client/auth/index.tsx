import React, { FunctionComponent } from "react";
import ReactDOM from "react-dom";

import { createManaged } from "coral-framework/lib/bootstrap";

import App from "./App";
import resizePopup from "./dom/resizePopup";
import { initLocalState } from "./local";
import localesData from "./locales";

// Import css variables.
import "coral-ui/theme/variables.css";

/**
 * Adapt popup height to current content every 200ms.
 *
 * The goal is to smooth out height inconsistensies  e.g. when fonts
 * are switched out or other resources being loaded that React has no influence
 * over.
 *
 * This works in addition to the ResizeObserver in App.tsx
 */
function pollPopupHeight(interval: number = 200) {
  setTimeout(() => {
    window.requestAnimationFrame(() => {
      resizePopup();
      pollPopupHeight(interval);
    });
  }, interval);
}

async function main() {
  const ManagedCoralContextProvider = await createManaged({
    initLocalState,
    localesData,
    userLocales: navigator.languages,
  });

  const Index: FunctionComponent = () => (
    <ManagedCoralContextProvider>
      <App />
    </ManagedCoralContextProvider>
  );

  ReactDOM.render(<Index />, document.getElementById("app"));
  // Set width.
  window.resizeTo(350, window.outerHeight);
  // Poll height.
  pollPopupHeight();
}

main();
