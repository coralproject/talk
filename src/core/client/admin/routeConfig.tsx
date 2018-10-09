import { makeRouteConfig, Route } from "found";
import React from "react";

import App from "./components/App";
import Community from "./components/Community";
import Configure from "./components/Configure";
import Moderate from "./components/Moderate";
import Stories from "./components/Stories";

export default makeRouteConfig(
  <Route path="admin" Component={App}>
    <Route path="moderate" Component={Moderate} />
    <Route path="community" Component={Community} />
    <Route path="stories" Component={Stories} />
    <Route path="configure" Component={Configure} />
  </Route>
);
