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
  ConfigureWebhookRoute,
  EmailConfigRoute,
  GeneralConfigRoute,
  ModerationConfigRoute,
  OrganizationConfigRoute,
  SlackConfigRoute,
  WebhooksConfigRoute,
  WordListConfigRoute,
} from "./routes/Configure/sections";
import { Sites } from "./routes/Configure/sections/Sites";
import AddSiteRoute from "./routes/Configure/sections/Sites/AddSiteRoute";
import SiteRoute from "./routes/Configure/sections/Sites/SiteRoute";
import ForgotPasswordRoute from "./routes/ForgotPassword";
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
          <Route
            path="reported/stories/:storyID"
            {...ReportedQueueRoute.routeConfig}
          />
          <Route
            path="reported/sites/:siteID"
            {...ReportedQueueRoute.routeConfig}
          />
          <Route path="pending" {...PendingQueueRoute.routeConfig} />
          <Route
            path="pending/stories/:storyID"
            {...PendingQueueRoute.routeConfig}
          />
          <Route
            path="pending/sites/:siteID"
            {...PendingQueueRoute.routeConfig}
          />
          <Route path="unmoderated" {...UnmoderatedQueueRoute.routeConfig} />
          <Route
            path="unmoderated/stories/:storyID"
            {...UnmoderatedQueueRoute.routeConfig}
          />
          <Route
            path="unmoderated/sites/:siteID"
            {...UnmoderatedQueueRoute.routeConfig}
          />
          <Route path="rejected" {...RejectedQueueRoute.routeConfig} />
          <Route
            path="rejected/stories/:storyID"
            {...RejectedQueueRoute.routeConfig}
          />
          <Route
            path="rejected/sites/:siteID"
            {...RejectedQueueRoute.routeConfig}
          />
          <Redirect
            from="stories/:storyID"
            to="/admin/moderate/reported/stories/:storyID"
          />
          <Redirect
            from="sites/:siteID"
            to="/admin/moderate/reported/sites/:siteID"
          />
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
            <Route path="slack" {...SlackConfigRoute.routeConfig} />
            <Route path="webhooks" {...WebhooksConfigRoute.routeConfig} />
            <Route
              path="webhooks/:webhookEndpointID"
              {...ConfigureWebhookRoute.routeConfig}
            />
          </Route>
          <Route path="configure/organization/sites" Component={Sites}>
            <Redirect from="/" to="/admin/configure/organization/sites/new" />
            <Route path="new" {...AddSiteRoute.routeConfig} />
            <Route path=":siteID" {...SiteRoute.routeConfig} />
          </Route>
        </Route>
      </Route>
    </Route>
    <Route path="invite" {...InviteRoute.routeConfig} />
    <Route path="login" {...LoginRoute.routeConfig} />
    <Route path="forgot-password" {...ForgotPasswordRoute.routeConfig} />
  </Route>
);
