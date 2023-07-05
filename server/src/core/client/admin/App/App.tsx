import { Resolver } from "found-relay";
import React, { FunctionComponent } from "react";

import { CoralContextConsumer } from "coral-framework/lib/bootstrap/CoralContext";
import { createRouter } from "coral-framework/lib/router";

import routeConfig from "../routeConfig";
import NotFound from "../routes/NotFound";

const Router = createRouter({
  routeConfig,
  renderError: function FarceRouterError({ error }) {
    return <div>{error.status === 404 ? <NotFound /> : "Error"}</div>;
  },
});

const App: FunctionComponent = () => (
  <CoralContextConsumer>
    {({ relayEnvironment }) => (
      <Router
        resolver={new Resolver(relayEnvironment)}
        matchContext={{
          relayEnvironment,
        }}
      />
    )}
  </CoralContextConsumer>
);

export default App;
