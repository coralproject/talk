import { Child as PymChild } from "pym.js";
import React from "react";
import { StatelessComponent } from "react";
import ReactDOM from "react-dom";

import { createManaged } from "talk-framework/lib/bootstrap";
import AppQuery from "talk-stream/queries/AppQuery";

import {
  OnPostMessageAuthError,
  OnPostMessageSetAuthToken,
  OnPymSetCommentID,
} from "./listeners";
import { initLocalState } from "./local";
import localesData from "./locales";

const listeners = (
  <>
    <OnPymSetCommentID />
    <OnPostMessageSetAuthToken />
    <OnPostMessageAuthError />
  </>
);

async function main() {
  const ManagedTalkContextProvider = await createManaged({
    initLocalState,
    localesData,
    userLocales: navigator.languages,
    pym: new PymChild({ polling: 100 }),
  });

  const Index: StatelessComponent = () => (
    <ManagedTalkContextProvider>
      <>
        {listeners}
        <AppQuery />
      </>
    </ManagedTalkContextProvider>
  );

  ReactDOM.render(<Index />, document.getElementById("app"));
}

main();
