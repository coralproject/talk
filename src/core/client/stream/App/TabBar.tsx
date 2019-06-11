import { Icon, MatchMedia, Tab, TabBar } from "coral-ui/components";
import { Localized } from "fluent-react/compat";
import * as React from "react";
import { FunctionComponent } from "react";

type TabValue = "COMMENTS" | "PROFILE" | "%future added value";

export interface Props {
  activeTab: TabValue;
  onTabClick: (tab: TabValue) => void;
  showProfileTab: boolean;
  showConfigureTab: boolean;
}

const AppTabBar: FunctionComponent<Props> = props => {
  return (
    <TabBar activeTab={props.activeTab} onTabClick={props.onTabClick}>
      <Tab tabID="COMMENTS">
        <Localized id="general-tabBar-commentsTab">
          <span>Comments</span>
        </Localized>
      </Tab>
      {props.showProfileTab && (
        <Tab tabID="PROFILE">
          <Localized id="general-tabBar-myProfileTab">
            <span>My Profile</span>
          </Localized>
        </Tab>
      )}
      {props.showConfigureTab && (
        <Tab tabID="CONFIGURE">
          <MatchMedia gteWidth="sm">
            {matches =>
              matches ? (
                <Localized id="general-tabBar-configure">
                  <span>Configure</span>
                </Localized>
              ) : (
                <Icon aria-label="Configure">settings</Icon>
              )
            }
          </MatchMedia>
        </Tab>
      )}
    </TabBar>
  );
};

export default AppTabBar;
