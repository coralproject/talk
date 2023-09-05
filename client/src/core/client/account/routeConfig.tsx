import { makeRouteConfig, Route } from "found";
import React, { FunctionComponent } from "react";

import CoralWindowContainer from "coral-ui/encapsulation/CoralWindowContainer";

import DownloadRoute from "./routes/download/Download";
import ConfirmRoute from "./routes/email/Confirm";
import UnsubscribeRoute from "./routes/notifications/Unsubscribe";
import ResetRoute from "./routes/password/Reset";

interface CoralContainerProps {
  children?: React.ReactNode;
}

/** Small wrapper that omits router props */
const CoralContainer: FunctionComponent<CoralContainerProps> = ({
  children,
}) => <CoralWindowContainer>{children}</CoralWindowContainer>;

export default makeRouteConfig(
  <Route path="account" Component={CoralContainer}>
    <Route path="password">
      <Route path="reset" {...ResetRoute.routeConfig} />
    </Route>
    <Route path="email">
      <Route path="confirm" {...ConfirmRoute.routeConfig} />
    </Route>
    <Route path="download" {...DownloadRoute.routeConfig} />
    <Route path="notifications">
      <Route path="unsubscribe" {...UnsubscribeRoute.routeConfig} />
    </Route>
  </Route>
);
