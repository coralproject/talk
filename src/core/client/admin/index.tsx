import { BrowserProtocol, queryMiddleware } from "farce";
import { createFarceRouter, createRender, makeRouteConfig, Route } from "found";
import { Resolver } from "found-relay";

import React from "react";
import { StatelessComponent } from "react";
import ReactDOM from "react-dom";

import { createManaged } from "talk-framework/lib/bootstrap";

import { TalkContextConsumer } from "talk-framework/lib/bootstrap/TalkContext";
import App from "./components/App";
import { initLocalState } from "./local";
import localesData from "./locales";

async function main() {
  const ManagedTalkContextProvider = await createManaged({
    initLocalState,
    localesData,
    userLocales: navigator.languages,
  });

  const Router = createFarceRouter({
    historyProtocol: new BrowserProtocol(),
    historyMiddlewares: [queryMiddleware],
    routeConfig: makeRouteConfig(<Route path="/" Component={App} />),
    render: createRender({}),
  });

  const Index: StatelessComponent = () => (
    <ManagedTalkContextProvider>
      <TalkContextConsumer>
        {({ relayEnvironment }) => (
          <Router resolver={new Resolver(relayEnvironment)} />
        )}
      </TalkContextConsumer>
    </ManagedTalkContextProvider>
  );

  ReactDOM.render(<Index />, document.getElementById("app"));
}

main();
