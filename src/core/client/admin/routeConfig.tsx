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
import ModerateContainer from "./routes/moderate/containers/ModerateContainer";
import {
  PendingQueueContainer,
  ReportedQueueContainer,
  UnmoderatedQueueContainer,
} from "./routes/moderate/containers/QueueContainer";
import RejectedQueueContainer from "./routes/moderate/containers/RejectedQueueContainer";
import Stories from "./routes/stories/components/Stories";

export default makeRouteConfig(
  <Route path="admin">
    <Route Component={RedirectLoginContainer}>
      <Route Component={App}>
        <Redirect from="/" to="/admin/moderate" />
        <Route path="moderate" {...ModerateContainer.routeConfig}>
          <Redirect from="/" to="/admin/moderate/reported" />
          <Route path="reported" {...ReportedQueueContainer.routeConfig} />
          <Route path="pending" {...PendingQueueContainer.routeConfig} />
          <Route
            path="unmoderated"
            {...UnmoderatedQueueContainer.routeConfig}
          />
          <Route path="rejected" {...RejectedQueueContainer.routeConfig} />
        </Route>
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
