import { makeRouteConfig, Route } from "found";
import React from "react";

import MainLayout from "./components/MainLayout";
import ResetPassword from "./routes/password/reset/Index";

export default makeRouteConfig(
  <Route path="account" Component={MainLayout}>
    <Route path="password">
      <Route path="reset" {...ResetPassword.routeConfig} />
    </Route>
  </Route>
);
