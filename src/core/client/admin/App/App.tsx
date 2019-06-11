import TransitionControl from "coral-framework/testHelpers/TransitionControl";
import { BrowserProtocol, queryMiddleware } from "farce";
import { createFarceRouter, ElementsRenderer } from "found";
import { Resolver } from "found-relay";
import React, { FunctionComponent } from "react";

import { CoralContextConsumer } from "coral-framework/lib/bootstrap/CoralContext";

import routeConfig from "../routeConfig";
import NotFound from "../routes/NotFound";

const Router = createFarceRouter({
  historyProtocol: new BrowserProtocol(),
  historyMiddlewares: [queryMiddleware],
  routeConfig,
  renderReady: ({ elements }) => (
    <>
      <ElementsRenderer elements={elements} />
      {// this enables router transition control when writing tests.
      process.env.NODE_ENV === "test" && <TransitionControl />}
    </>
  ),
  renderError: ({ error }) => (
    <div>{error.status === 404 ? <NotFound /> : "Error"}</div>
  ),
});

const App: FunctionComponent = () => (
  <CoralContextConsumer>
    {({ relayEnvironment }) => (
      <Router resolver={new Resolver(relayEnvironment)} />
    )}
  </CoralContextConsumer>
);

export default App;
