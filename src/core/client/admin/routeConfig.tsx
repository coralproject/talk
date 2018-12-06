import { makeRouteConfig, Redirect, Route } from "found";
import React from "react";

import App from "./components/App";
import RedirectAppContainer from "./containers/RedirectAppContainer";
import RedirectLoginContainer from "./containers/RedirectLoginContainer";
import Community from "./routes/community/components/Community";
import ConfigureModeration from "./routes/configure/components/Moderation";
import ConfigureContainer from "./routes/configure/containers/ConfigureContainer";
import ConfigureAuthContainer from "./routes/configure/sections/auth/containers/AuthContainer";
import Login from "./routes/login/components/Login";
import Moderate from "./routes/moderate/components/Moderate";
import Stories from "./routes/stories/components/Stories";

export default makeRouteConfig(
  <Route path="admin">
    <Route Component={RedirectLoginContainer}>
      <Route Component={App}>
        <Redirect from="/" to="/admin/moderate" />
        <Route path="moderate" Component={Moderate} />
        <Route path="community" Component={Community} />
        <Route path="stories" Component={Stories} />
        <Route path="configure" Component={ConfigureContainer}>
          <Redirect from="/" to="/admin/configure/moderation" />
          <Route path="moderation" Component={ConfigureModeration} />
          <Route path="auth" {...ConfigureAuthContainer.routeConfig} />
        </Route>
      </Route>
    </Route>
    <Route Component={RedirectAppContainer}>
      <Route path="login" Component={Login} />
    </Route>
  </Route>
);
