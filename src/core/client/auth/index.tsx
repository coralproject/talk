import React from "react";
import { StatelessComponent } from "react";
import ReactDOM from "react-dom";

import { createManaged } from "talk-framework/lib/bootstrap";

import resizePopup from "./dom/resizePopup";
import { initLocalState } from "./local";
import localesData from "./locales";
import AppQuery from "./queries/AppQuery";

/**
 * Adapt popup height to current content every 100ms.
 *
 * The goal is to smooth out height inconsistensies  e.g. when fonts
 * are switched out or other resources being loaded that React has no influence
 * over.
 *
 * This works in addition to <AutoHeightContainer /> which
 * adapt popup height when React does an update.
 */
function pollPopupHeight(interval: number = 100) {
  setTimeout(() => {
    window.requestAnimationFrame(() => {
      resizePopup();
      pollPopupHeight(interval);
    });
  }, interval);
}

async function main() {
  const ManagedTalkContextProvider = await createManaged({
    initLocalState,
    localesData,
    userLocales: navigator.languages,
  });

  const Index: StatelessComponent = () => (
    <ManagedTalkContextProvider>
      <AppQuery />
    </ManagedTalkContextProvider>
  );

  ReactDOM.render(<Index />, document.getElementById("app"));
  pollPopupHeight();
}

main();
