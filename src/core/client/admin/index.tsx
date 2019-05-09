import React, { FunctionComponent } from "react";
import ReactDOM from "react-dom";
import { createManaged } from "talk-framework/lib/bootstrap";

import EntryContainer from "./containers/EntryContainer";
import { initLocalState } from "./local";
import localesData from "./locales";

async function main() {
  const ManagedTalkContextProvider = await createManaged({
    initLocalState,
    localesData,
    userLocales: navigator.languages,
  });

  const Index: FunctionComponent = () => (
    <ManagedTalkContextProvider>
      <EntryContainer />
    </ManagedTalkContextProvider>
  );

  ReactDOM.render(<Index />, document.getElementById("app"));
}

main();
