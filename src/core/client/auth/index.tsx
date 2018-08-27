import React from "react";
import { StatelessComponent } from "react";
import ReactDOM from "react-dom";

import {
  createContext,
  TalkContext,
  TalkContextProvider,
} from "talk-framework/lib/bootstrap";

import AppContainer from "./containers/AppContainer";
import resizePopup from "./dom/resizePopup";
import { initLocalState } from "./local";
import localesData from "./locales";

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

// This is called when the context is first initialized.
async function init({ relayEnvironment }: TalkContext) {
  await initLocalState(relayEnvironment);
}

async function main() {
  // Bootstrap our context.
  const context = await createContext({
    init,
    localesData,
    userLocales: navigator.languages,
  });

  const Index: StatelessComponent = () => (
    <TalkContextProvider value={context}>
      <AppContainer />
    </TalkContextProvider>
  );

  ReactDOM.render(<Index />, document.getElementById("app"));
  pollPopupHeight();
}

main();
