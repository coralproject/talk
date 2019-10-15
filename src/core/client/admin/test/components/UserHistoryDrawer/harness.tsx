import { BrowserProtocol, queryMiddleware } from "farce";
import {
  ConnectedRouter,
  createFarceRouter,
  makeRouteConfig,
  Route,
} from "found";
import { Resolver } from "found-relay";
import React, { FunctionComponent } from "react";

import UserHistoryDrawer from "coral-admin/components/UserHistoryDrawer";
import { CoralContextConsumer } from "coral-framework/lib/bootstrap/CoralContext";

interface Props {
  userID: string;
}

const harnessRouter = (userID: string): ConnectedRouter => {
  const routeConfig = makeRouteConfig(<Route path="/" />);

  return createFarceRouter({
    historyProtocol: new BrowserProtocol(),
    historyMiddlewares: [queryMiddleware],
    routeConfig,
    renderReady: function FarceRouterReady({ elements }) {
      return (
        <div data-testid="test-container">
          <UserHistoryDrawer
            userID={userID}
            open
            onClose={() => {
              return;
            }}
          />
        </div>
      );
    },
    renderError: function FarceError({ error }) {
      return <div>Not Found</div>;
    },
  });
};

const Harness: FunctionComponent<Props> = ({ userID }) => {
  const Router = harnessRouter(userID);

  return (
    <CoralContextConsumer>
      {({ relayEnvironment }) => (
        <Router resolver={new Resolver(relayEnvironment)} />
      )}
    </CoralContextConsumer>
  );
};

export default Harness;
