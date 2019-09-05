import { makeRouteConfig, Route } from "found";
import React from "react";

import DownloadRoute from "./routes/download/Download";
import ConfirmRoute from "./routes/email/Confirm";
import UnsubscribeRoute from "./routes/notifications/Unsubscribe";
import ResetRoute from "./routes/password/Reset";

export default makeRouteConfig(
  <Route path="account">
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
