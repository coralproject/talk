import { BrowserProtocol, queryMiddleware } from "farce";
import { createFarceRouter } from "found";
import { Resolver } from "found-relay";
import React, { FunctionComponent } from "react";

import UserHistoryDrawerContainer from "coral-admin/components/UserHistoryDrawer/UserHistoryDrawerContainer";
import { CoralContextConsumer } from "coral-framework/lib/bootstrap/CoralContext";
import { makeRouteConfig, Route } from "found";
import { ConnectedRouter } from "found";

interface Props {
  userID: string;
}

const harnessRouter = (userID: string): ConnectedRouter => {
  const routeConfig = makeRouteConfig(<Route path="/" />);

  return createFarceRouter({
    historyProtocol: new BrowserProtocol(),
    historyMiddlewares: [queryMiddleware],
    routeConfig,
    renderReady: ({ elements }) => (
      <div data-testid="test-container">
        <UserHistoryDrawerContainer
          userID={userID}
          open
          onClose={() => {
            return;
          }}
        />
      </div>
    ),
    renderError: ({ error }) => <div>Not Found</div>,
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
