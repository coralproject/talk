import { BrowserProtocol, queryMiddleware } from "farce";
import { createFarceRouter, ElementsRenderer } from "found";
import { Resolver } from "found-relay";
import React, { FunctionComponent } from "react";
import TransitionControl from "talk-framework/testHelpers/TransitionControl";

import { TalkContextConsumer } from "talk-framework/lib/bootstrap/TalkContext";

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

const EntryContainer: FunctionComponent = () => (
  <TalkContextConsumer>
    {({ relayEnvironment }) => (
      <Router resolver={new Resolver(relayEnvironment)} />
    )}
  </TalkContextConsumer>
);

export default EntryContainer;
