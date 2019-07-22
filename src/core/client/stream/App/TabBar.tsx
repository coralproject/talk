import { Icon, MatchMedia, Tab, TabBar } from "coral-ui/components";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";

type TabValue = "COMMENTS" | "PROFILE" | "%future added value";

export interface Props {
  activeTab: TabValue;
  onTabClick: (tab: TabValue) => void;
  showProfileTab: boolean;
  showConfigureTab: boolean;
}

const AppTabBar: FunctionComponent<Props> = props => {
  return (
    <TabBar
      className={CLASSES.tabBar.$root}
      activeTab={props.activeTab}
      onTabClick={props.onTabClick}
    >
      <Tab className={CLASSES.tabBar.allComments} tabID="COMMENTS">
        <Localized id="general-tabBar-commentsTab">
          <span>Comments</span>
        </Localized>
      </Tab>
      {props.showProfileTab && (
        <Tab className={CLASSES.tabBar.myProfile} tabID="PROFILE">
          <Localized id="general-tabBar-myProfileTab">
            <span>My Profile</span>
          </Localized>
        </Tab>
      )}
      {props.showConfigureTab && (
        <Tab className={CLASSES.tabBar.configure} tabID="CONFIGURE">
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
