import { BrowserProtocol, queryMiddleware } from "farce";
import { createFarceRouter, createRender } from "found";
import { Resolver } from "found-relay";

import React, { StatelessComponent } from "react";
import { TalkContextConsumer } from "talk-framework/lib/bootstrap/TalkContext";
import routeConfig from "../routeConfig";
import NotFound from "../routes/NotFound";

const Router = createFarceRouter({
  historyProtocol: new BrowserProtocol(),
  historyMiddlewares: [queryMiddleware],
  routeConfig,
  render: createRender({
    renderError: ({ error }) => (
      <div>{error.status === 404 ? <NotFound /> : "Error"}</div>
    ),
  }),
});

const EntryContainer: StatelessComponent = () => (
  <TalkContextConsumer>
    {({ relayEnvironment }) => (
      <Router resolver={new Resolver(relayEnvironment)} />
    )}
  </TalkContextConsumer>
);

export default EntryContainer;
