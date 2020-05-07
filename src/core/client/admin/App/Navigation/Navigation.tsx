import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import { AppBarNavigation, Button } from "coral-ui/components/v2";

import DashboardLinkQuery from "./DashboardLinkQuery";
import NavigationLink from "./NavigationLink";

interface Props {
  showConfigure: boolean;
  showDashboard: boolean;
}

const Navigation: FunctionComponent<Props> = (props) => {
  const [showSiteSelect, setShowSiteSelect] = useState<boolean>(false);
  const toggleSiteSelector = useCallback(() => {
    setShowSiteSelect(!showSiteSelect);
  }, [showSiteSelect]);
  return (
    <AppBarNavigation>
      <Localized id="navigation-moderate">
        <NavigationLink to="/admin/moderate">Moderate</NavigationLink>
      </Localized>
      <Localized id="navigation-stories">
        <NavigationLink to="/admin/stories">Stories</NavigationLink>
      </Localized>
      <Localized id="navigation-community">
        <NavigationLink to="/admin/community">Community</NavigationLink>
      </Localized>
      {props.showConfigure && (
        <Localized id="navigation-configure">
          <NavigationLink to="/admin/configure">Configure</NavigationLink>
        </Localized>
      )}
      {props.showDashboard && (
        <>
          <Localized id="navigation-dashboard">
            <Button onClick={toggleSiteSelector}>Dashboard</Button>
          </Localized>
          {showSiteSelect && <DashboardLinkQuery />}
        </>
      )}
    </AppBarNavigation>
  );
};

export default Navigation;
