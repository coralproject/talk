import { Resolver } from "found-relay";
import React, { FunctionComponent } from "react";

import { CoralContextConsumer } from "coral-framework/lib/bootstrap/CoralContext";
import { createRouter } from "coral-framework/lib/router";

import routeConfig from "../routeConfig";
import NotFound from "../routes/NotFound";
import MainLayout from "./MainLayout";

import "./App.css";

const Router = createRouter({
  routeConfig,
  renderError: function FarceRouterError({ error }) {
    return <div>{error.status === 404 ? <NotFound /> : "Error"}</div>;
  },
});

const EntryContainer: FunctionComponent = () => (
  <CoralContextConsumer>
    {({ relayEnvironment }) => (
      <MainLayout>
        <Router
          resolver={new Resolver(relayEnvironment)}
          matchContext={{
            relayEnvironment,
          }}
        />
      </MainLayout>
    )}
  </CoralContextConsumer>
);

export default EntryContainer;
