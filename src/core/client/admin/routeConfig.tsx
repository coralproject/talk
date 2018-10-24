import { makeRouteConfig, Route } from "found";
import React from "react";

import App from "./components/App";
import Community from "./routes/community/components/Community";
import Configure from "./routes/configure/components/Configure";
import Login from "./routes/login/components/Login";
import Moderate from "./routes/moderate/components/Moderate";
import Stories from "./routes/stories/components/Stories";

export default makeRouteConfig(
  <Route path="admin">
    <Route path="login" Component={Login} />
    <Route Component={App}>
      <Route path="moderate" Component={Moderate} />
      <Route path="community" Component={Community} />
      <Route path="stories" Component={Stories} />
      <Route path="configure" Component={Configure} />
    </Route>
  </Route>
);
