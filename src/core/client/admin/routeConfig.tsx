import { makeRouteConfig, Redirect, Route } from "found";
import React from "react";

import { GQLUSER_ROLE } from "coral-framework/schema";
import MainRoute from "./App/MainRoute";
import { Ability } from "./permissions";
import { createAuthCheckRoute } from "./routes/AuthCheck";
import CommunityRoute from "./routes/Community";
import ConfigureRoute from "./routes/Configure";
import {
  AdvancedConfigRoute,
  AuthConfigRoute,
  EmailConfigRoute,
  GeneralConfigRoute,
  ModerationConfigRoute,
  OrganizationConfigRoute,
  WordListConfigRoute,
} from "./routes/Configure/sections";
import InviteRoute from "./routes/Invite";
import LoginRoute from "./routes/Login";
import ModerateRoute from "./routes/Moderate";
import {
  PendingQueueRoute,
  RejectedQueueRoute,
  ReportedQueueRoute,
  UnmoderatedQueueRoute,
} from "./routes/Moderate/Queue";
import SingleModerateRoute from "./routes/Moderate/SingleModerate";
import StoriesRoute from "./routes/Stories";

export default makeRouteConfig(
  <Route path="admin">
    <Route
      {...createAuthCheckRoute({ role: GQLUSER_ROLE.MODERATOR }).routeConfig}
    >
      <Route {...MainRoute.routeConfig}>
        <Redirect from="/" to="/admin/moderate" />
        <Route
          path="moderate/comment/:commentID"
          {...SingleModerateRoute.routeConfig}
        />
        <Route path="moderate" {...ModerateRoute.routeConfig}>
          <Redirect from="/" to="/admin/moderate/reported" />
          <Route path="reported" {...ReportedQueueRoute.routeConfig} />
          <Route path="reported/:storyID" {...ReportedQueueRoute.routeConfig} />
          <Route path="pending" {...PendingQueueRoute.routeConfig} />
          <Route path="pending/:storyID" {...PendingQueueRoute.routeConfig} />
          <Route path="unmoderated" {...UnmoderatedQueueRoute.routeConfig} />
          <Route
            path="unmoderated/:storyID"
            {...UnmoderatedQueueRoute.routeConfig}
          />
          <Route path="rejected" {...RejectedQueueRoute.routeConfig} />
          <Route path="rejected/:storyID" {...RejectedQueueRoute.routeConfig} />
          <Redirect from=":storyID" to="/admin/moderate/reported/:storyID" />
        </Route>
        <Route path="stories" {...StoriesRoute.routeConfig} />
        <Route path="community" {...CommunityRoute.routeConfig} />
        <Route
          {...createAuthCheckRoute({
            ability: Ability.CHANGE_CONFIGURATION,
          }).routeConfig}
        >
          <Route path="configure" Component={ConfigureRoute}>
            <Redirect from="/" to="/admin/configure/general" />
            <Route path="general" {...GeneralConfigRoute.routeConfig} />
            <Route
              path="organization"
              {...OrganizationConfigRoute.routeConfig}
            />
            <Route path="moderation" {...ModerationConfigRoute.routeConfig} />
            <Route path="wordList" {...WordListConfigRoute.routeConfig} />
            <Route path="auth" {...AuthConfigRoute.routeConfig} />
            <Route path="advanced" {...AdvancedConfigRoute.routeConfig} />
            <Route path="email" {...EmailConfigRoute.routeConfig} />
          </Route>
        </Route>
      </Route>
    </Route>
    <Route path="invite" {...InviteRoute.routeConfig} />
    <Route path="login" {...LoginRoute.routeConfig} />
  </Route>
);
