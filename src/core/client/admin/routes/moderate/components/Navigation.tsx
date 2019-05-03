import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { getModerationLink } from "talk-admin/helpers";
import { Counter, Icon, SubBarNavigation } from "talk-ui/components";

import NavigationLink from "./NavigationLink";

interface Props {
  unmoderatedCount?: number;
  reportedCount?: number;
  pendingCount?: number;
  storyID?: string | null;
}

const Navigation: FunctionComponent<Props> = ({
  unmoderatedCount,
  reportedCount,
  pendingCount,
  storyID,
}) => (
  <SubBarNavigation>
    <NavigationLink to={getModerationLink("reported", storyID)}>
      <Icon>flag</Icon>
      <Localized id="moderate-navigation-reported">
        <span>Reported</span>
      </Localized>
      {reportedCount !== undefined && (
        <Counter data-testid="moderate-navigation-reported-count">
          {reportedCount}
        </Counter>
      )}
    </NavigationLink>
    <NavigationLink to={getModerationLink("pending", storyID)}>
      <Icon>access_time</Icon>
      <Localized id="moderate-navigation-pending">
        <span>Pending</span>
      </Localized>
      {pendingCount !== undefined && (
        <Counter data-testid="moderate-navigation-pending-count">
          {pendingCount}
        </Counter>
      )}
    </NavigationLink>
    <NavigationLink to={getModerationLink("unmoderated", storyID)}>
      <Icon>forum</Icon>
      <Localized id="moderate-navigation-unmoderated">
        <span>Unmoderated</span>
      </Localized>
      {unmoderatedCount !== undefined && (
        <Counter data-testid="moderate-navigation-unmoderated-count">
          {unmoderatedCount}
        </Counter>
      )}
    </NavigationLink>
    <NavigationLink to={getModerationLink("rejected", storyID)}>
      <Icon>cancel</Icon>
      <Localized id="moderate-navigation-rejected">
        <span>Rejected</span>
      </Localized>
    </NavigationLink>
  </SubBarNavigation>
);

export default Navigation;
