import { Child as PymChild } from "pym.js";
import React from "react";
import { FunctionComponent } from "react";
import ReactDOM from "react-dom";

import { createManaged } from "coral-framework/lib/bootstrap";
import AppContainer from "coral-stream/containers/AppContainer";

import {
  OnEvents,
  OnPostMessageSetAccessToken,
  OnPymLogin,
  OnPymLogout,
  OnPymSetCommentID,
} from "./listeners";
import { initLocalState } from "./local";
import localesData from "./locales";

// Import css variables.
import "coral-ui/theme/variables.css";

const listeners = (
  <>
    <OnPymLogin />
    <OnPymLogout />
    <OnPymSetCommentID />
    <OnPostMessageSetAccessToken />
    <OnEvents />
  </>
);

async function main() {
  const ManagedCoralContextProvider = await createManaged({
    initLocalState,
    localesData,
    userLocales: navigator.languages,
    pym: new PymChild({ polling: 100 }),
  });

  const Index: FunctionComponent = () => (
    <ManagedCoralContextProvider>
      <>
        {listeners}
        <AppContainer />
      </>
    </ManagedCoralContextProvider>
  );

  ReactDOM.render(<Index />, document.getElementById("app"));
}

main();
