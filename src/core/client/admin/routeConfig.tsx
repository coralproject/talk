import { makeRouteConfig, Redirect, Route } from "found";
import React from "react";

import { GQLUSER_ROLE } from "coral-framework/schema";
import AppContainer from "./containers/AppContainer";
import createAuthCheckContainer from "./containers/AuthCheckContainer";
import { Ability } from "./permissions";
import CommunityContainer from "./routes/community/containers/CommunityContainer";
import ConfigureContainer from "./routes/configure/containers/ConfigureContainer";
import ConfigureAdvancedRouteContainer from "./routes/configure/sections/advanced/containers/AdvancedConfigRouteContainer";
import ConfigureAuthRouteContainer from "./routes/configure/sections/auth/containers/AuthConfigRouteContainer";
import ConfigureGeneralRouteContainer from "./routes/configure/sections/general/containers/GeneralConfigRouteContainer";
import ConfigureModerationRouteContainer from "./routes/configure/sections/moderation/containers/ModerationConfigRouteContainer";
import ConfigureOrganizationRouteContainer from "./routes/configure/sections/organization/containers/OrganizationRouteContainer";
import ConfigureWordListRouteContainer from "./routes/configure/sections/wordList/containers/WordListRouteContainer";
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
import StoriesContainer from "./routes/stories/containers/StoriesContainer";

export default makeRouteConfig(
  <Route path="admin">
    <Route
      {...createAuthCheckContainer({ role: GQLUSER_ROLE.MODERATOR })
        .routeConfig}
    >
      <Route {...AppContainer.routeConfig}>
        <Redirect from="/" to="/admin/moderate" />
        <Route
          path="moderate/comment/:commentID"
          {...SingleModerateContainer.routeConfig}
        />
        <Route path="moderate" {...ModerateContainer.routeConfig}>
          <Redirect from="/" to="/admin/moderate/reported" />
          <Route path="reported" {...ReportedQueueContainer.routeConfig} />
          <Route
            path="reported/:storyID"
            {...ReportedQueueContainer.routeConfig}
          />
          <Route path="pending" {...PendingQueueContainer.routeConfig} />
          <Route
            path="pending/:storyID"
            {...PendingQueueContainer.routeConfig}
          />
          <Route
            path="unmoderated"
            {...UnmoderatedQueueContainer.routeConfig}
          />
          <Route
            path="unmoderated/:storyID"
            {...UnmoderatedQueueContainer.routeConfig}
          />
          <Route path="rejected" {...RejectedQueueContainer.routeConfig} />
          <Route
            path="rejected/:storyID"
            {...RejectedQueueContainer.routeConfig}
          />
          <Redirect from=":storyID" to="/admin/moderate/reported/:storyID" />
        </Route>
        <Route path="stories" {...StoriesContainer.routeConfig} />
        <Route path="community" {...CommunityContainer.routeConfig} />
        <Route path="stories" Component={Stories} />
        <Route
          {...createAuthCheckContainer({
            ability: Ability.CHANGE_CONFIGURATION,
          }).routeConfig}
        >
          <Route path="configure" Component={ConfigureContainer}>
            <Redirect from="/" to="/admin/configure/general" />
            <Route
              path="general"
              {...ConfigureGeneralRouteContainer.routeConfig}
            />
            <Route
              path="organization"
              {...ConfigureOrganizationRouteContainer.routeConfig}
            />
            <Route
              path="moderation"
              {...ConfigureModerationRouteContainer.routeConfig}
            />
            <Route
              path="wordList"
              {...ConfigureWordListRouteContainer.routeConfig}
            />
            <Route path="auth" {...ConfigureAuthRouteContainer.routeConfig} />
            <Route
              path="advanced"
              {...ConfigureAdvancedRouteContainer.routeConfig}
            />
          </Route>
        </Route>
      </Route>
    </Route>
    <Route path="login" {...LoginContainer.routeConfig} />
  </Route>
);
