import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";
import { Tab, TabBar } from "talk-ui/components";

type TabValue = "COMMENTS" | "PROFILE" | "%future added value";

export interface Props {
  activeTab: TabValue;
  onTabClick: (tab: TabValue) => void;
  commentCount: number;
  showProfileTab: boolean;
}

const AppTabBar: StatelessComponent<Props> = props => {
  return (
    <TabBar activeTab={props.activeTab} onTabClick={props.onTabClick}>
      <Tab tabId="COMMENTS">
        <Localized
          id="general-tabBar-commentsTab"
          $commentCount={props.commentCount}
        >
          <span>{"{$commentCount} Comments"}</span>
        </Localized>
      </Tab>
      {props.showProfileTab && (
        <Tab tabId="PROFILE">
          <Localized id="general-tabBar-myProfileTab">
            <span>My Profile</span>
          </Localized>
        </Tab>
      )}
    </TabBar>
  );
};

export default AppTabBar;
