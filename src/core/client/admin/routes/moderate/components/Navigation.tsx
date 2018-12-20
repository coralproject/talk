import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { Counter, Icon, SubBarNavigation } from "talk-ui/components";

import NavigationLink from "./NavigationLink";

interface Props {
  unmoderatedCount?: number;
  reportedCount?: number;
  pendingCount?: number;
  children?: React.ReactNode;
}

const Navigation: StatelessComponent<Props> = ({
  unmoderatedCount,
  reportedCount,
  pendingCount,
}) => (
  <SubBarNavigation>
    <NavigationLink to="/admin/moderate/reported">
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
    <NavigationLink to="/admin/moderate/pending">
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
    <NavigationLink to="/admin/moderate/unmoderated">
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
    <NavigationLink to="/admin/moderate/rejected">
      <Icon>cancel</Icon>
      <Localized id="moderate-navigation-rejected">
        <span>Rejected</span>
      </Localized>
    </NavigationLink>
  </SubBarNavigation>
);

export default Navigation;
