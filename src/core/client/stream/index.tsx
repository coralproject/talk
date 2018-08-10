import { Child as PymChild } from "pym.js";
import React from "react";
import { StatelessComponent } from "react";
import ReactDOM from "react-dom";

import {
  createContext,
  TalkContext,
  TalkContextProvider,
} from "talk-framework/lib/bootstrap";

import AppContainer from "./containers/AppContainer";
import { initLocalState } from "./local";
import localesData from "./locales";
import { withSetCommentID } from "./pym";

const pymFeatures = [withSetCommentID];

// This is called when the context is first initialized.
async function init(context: TalkContext) {
  await initLocalState(context.relayEnvironment, context);
  pymFeatures.forEach(f => f(context));
}

async function main() {
  // Bootstrap our context.
  const context = await createContext({
    init,
    localesData,
    userLocales: navigator.languages,
    pym: new PymChild({ polling: 100 }),
  });

  const Index: StatelessComponent = () => (
    <TalkContextProvider
      value={{ ...context, mediaQueryValues: { width: 640 } }}
    >
      <AppContainer />
    </TalkContextProvider>
  );

  ReactDOM.render(<Index />, document.getElementById("app"));
}

main();
