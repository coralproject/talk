import { makeRouteConfig, Route } from "found";
import React from "react";

import ResetRoute from "./routes/password/Reset";

export default makeRouteConfig(
  <Route path="account">
    <Route path="password">
      <Route path="reset" {...ResetRoute.routeConfig} />
    </Route>
  </Route>
);
