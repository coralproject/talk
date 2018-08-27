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
 * If fonts api is available, resize popup once
 * fonts are loaded!
 */
if ((document as any).fonts) {
  setTimeout(
    requestAnimationFrame(() => () =>
      (document as any).fonts.ready.then(resizePopup)
    ),
    100
  );
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
}

main();
