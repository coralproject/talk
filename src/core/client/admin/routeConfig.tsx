import { makeRouteConfig, Redirect, Route } from "found";
import React from "react";

import { GQLUSER_ROLE } from "coral-framework/schema";

import MainRoute from "./App/MainRoute";
import { Ability } from "./permissions";
import { createAuthCheckRoute } from "./routes/AuthCheck";
import CommunityRoute from "./routes/Community";
import ConfigureRoute from "./routes/Configure";
import {
  AddExternalModerationPhaseRoute,
  AddWebhookEndpointRoute,
  AdvancedConfigRoute,
  AuthConfigRoute,
  ConfigureExternalModerationPhaseRoute,
  ConfigureWebhookEndpointRoute,
  EmailConfigRoute,
  GeneralConfigRoute,
  ModerationConfigRoute,
  ModerationPhasesConfigRoute,
  OrganizationConfigRoute,
  SlackConfigRoute,
  WebhookEndpointsConfigRoute,
  WordListConfigRoute,
} from "./routes/Configure/sections";
import CreateEmailDomainRoute from "./routes/Configure/sections/EmailDomains/CreateEmailDomainRoute";
import UpdateEmailDomainRoute from "./routes/Configure/sections/EmailDomains/UpdateEmailDomainRoute";
import ModerationPhasesLayout from "./routes/Configure/sections/ModerationPhases/ModerationPhasesLayout";
import { Sites } from "./routes/Configure/sections/Sites";
import AddSiteRoute from "./routes/Configure/sections/Sites/AddSiteRoute";
import SiteRoute from "./routes/Configure/sections/Sites/SiteRoute";
import WebhookEndpointsLayout from "./routes/Configure/sections/WebhookEndpoints/WebhookEndpointsLayout";
import DashboardRoute from "./routes/Dashboard";
import SiteDashboardRoute from "./routes/Dashboard/SiteDashboardRoute";
import ForgotPasswordRoute from "./routes/ForgotPassword";
import InviteRoute from "./routes/Invite";
import LoginRoute from "./routes/Login";
import ModerateRoute from "./routes/Moderate";
import {
  ApprovedQueueRouteConfig,
  ForReviewQueueRouteConfig,
  ModerationQueue,
  PendingQueueRoute,
  RejectedQueueRouteConfig,
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
          <Route path="/" Component={ModerationQueue} />
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
          <Route path="approved" {...ApprovedQueueRouteConfig} />
          <Route path="rejected" {...RejectedQueueRouteConfig} />
          <Route
            path="rejected/stories/:storyID"
            {...RejectedQueueRouteConfig}
          />
          <Route path="rejected/sites/:siteID" {...RejectedQueueRouteConfig} />
          <Route path="review" {...ForReviewQueueRouteConfig} />
          <Route
            path="review/stories/:storyID"
            {...ForReviewQueueRouteConfig}
          />
          <Route path="review/sites/:siteID" {...ForReviewQueueRouteConfig} />
          <Route
            path="approved/stories/:storyID"
            {...ApprovedQueueRouteConfig}
          />
          <Route path="approved/sites/:siteID" {...ApprovedQueueRouteConfig} />
          <Route path="stories/:storyID" Component={ModerationQueue} />
          <Route path="sites/:siteID" Component={ModerationQueue} />
        </Route>
        <Route path="stories" {...StoriesRoute.routeConfig} />
        <Route path="dashboard" {...DashboardRoute.routeConfig} />
        <Route path="dashboard/:siteID" {...SiteDashboardRoute.routeConfig} />
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
            <Route path="moderation">
              <Route path="/" {...ModerationConfigRoute.routeConfig} />
              <Route
                path="/domains/add"
                {...CreateEmailDomainRoute.routeConfig}
              />
              <Route
                path="/domains/:emailDomainID"
                {...UpdateEmailDomainRoute.routeConfig}
              />
            </Route>
            <Route path="wordList" {...WordListConfigRoute.routeConfig} />
            <Route path="auth" {...AuthConfigRoute.routeConfig} />
            <Route path="advanced" {...AdvancedConfigRoute.routeConfig} />
            <Route path="email" {...EmailConfigRoute.routeConfig} />
            <Route path="slack" {...SlackConfigRoute.routeConfig} />
          </Route>
          <Route
            path="configure/moderation/phases"
            Component={ModerationPhasesLayout}
          >
            <Route path="/" {...ModerationPhasesConfigRoute.routeConfig} />
            <Route path="add" Component={AddExternalModerationPhaseRoute} />
            <Route
              path=":phaseID"
              {...ConfigureExternalModerationPhaseRoute.routeConfig}
            />
          </Route>
          <Route path="configure/webhooks" Component={WebhookEndpointsLayout}>
            <Route path="/" {...WebhookEndpointsConfigRoute.routeConfig} />
            <Route path="add" {...AddWebhookEndpointRoute.routeConfig} />
            <Route
              path="endpoint/:webhookEndpointID"
              {...ConfigureWebhookEndpointRoute.routeConfig}
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
