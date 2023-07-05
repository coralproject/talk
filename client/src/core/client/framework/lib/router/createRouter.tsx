import { BrowserProtocol, queryMiddleware } from "farce";
import {
  ConnectedRouterProps,
  createFarceRouter,
  ElementsRenderer,
  FarceRouterOptions,
} from "found";
import React, { ComponentType } from "react";
import { Environment } from "relay-runtime";

import { Overwrite, RequireProperty } from "coral-common/types";
import TransitionControl from "coral-framework/testHelpers/TransitionControl";

export interface MatchContext {
  relayEnvironment: Environment;
}

export type Router = ComponentType<
  Overwrite<ConnectedRouterProps, { matchContext: MatchContext }>
>;

type CreateRouterOptions = RequireProperty<
  Partial<FarceRouterOptions>,
  "routeConfig"
>;

export default function createRouter(options: CreateRouterOptions): Router {
  return createFarceRouter({
    historyProtocol: new BrowserProtocol(),
    historyMiddlewares: [queryMiddleware],
    renderReady: function FarceRouterReady({ elements }) {
      return (
        <>
          <ElementsRenderer elements={elements} />
          {process.env.NODE_ENV === "test" && <TransitionControl />}
        </>
      );
    },
    renderError: function FarceRouterError({ error }) {
      return <div>{error.status === 404 ? "Not Found" : "Error"}</div>;
    },
    ...options,
  }) as any;
}
