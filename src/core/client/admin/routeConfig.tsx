import { makeRouteConfig, Redirect, Route } from "found";
import React from "react";

import App from "./components/App";
import AuthCheckContainer from "./containers/AuthCheckContainer";
import Community from "./routes/community/components/Community";
import ConfigureModeration from "./routes/configure/components/Moderation";
import ConfigureContainer from "./routes/configure/containers/ConfigureContainer";
import ConfigureAuthRouteContainer from "./routes/configure/sections/auth/containers/AuthRouteContainer";
import LoginContainer from "./routes/login/containers/LoginContainer";
import ModerateContainer from "./routes/moderate/containers/ModerateContainer";
import {
  PendingQueueContainer,
  ReportedQueueContainer,
  UnmoderatedQueueContainer,
} from "./routes/moderate/containers/QueueContainer";
import RejectedQueueContainer from "./routes/moderate/containers/RejectedQueueContainer";
import SingleModerateContainer from "./routes/moderate/containers/SingleModerateContainer";
import Stories from "./routes/stories/components/Stories";

export default makeRouteConfig(
  <Route path="admin">
    <Route {...AuthCheckContainer.routeConfig}>
      <Route Component={App}>
        <Redirect from="/" to="/admin/moderate" />
        <Route
          path="moderate/comment/:commentID"
          {...SingleModerateContainer.routeConfig}
        />
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
          <Route path="auth" {...ConfigureAuthRouteContainer.routeConfig} />
        </Route>
      </Route>
    </Route>
    <Route path="login" {...LoginContainer.routeConfig} />
  </Route>
);
