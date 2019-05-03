import { makeRouteConfig, Route } from "found";
import React from "react";

import ResetPassword from "./routes/password/reset/Index";

export default makeRouteConfig(
  <Route path="account">
    <Route path="password">
      <Route path="reset" Component={ResetPassword} />
    </Route>
  </Route>
);
