import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { GQLSTORY_MODE } from "coral-framework/schema";
import CLASSES from "coral-stream/classes";
import { Icon, MatchMedia, Tab, TabBar } from "coral-ui/components";

type TabValue = "COMMENTS" | "PROFILE" | "%future added value";

export interface Props {
  activeTab: TabValue;
  onTabClick: (tab: TabValue) => void;
  showProfileTab: boolean;
  showConfigureTab: boolean;
  mode: "%future added value" | "COMMENTS" | "QA" | null;
}

const AppTabBar: FunctionComponent<Props> = props => {
  return (
    <TabBar
      className={CLASSES.tabBar.$root}
      activeTab={props.activeTab}
      onTabClick={props.onTabClick}
    >
      <Tab
        className={cn(CLASSES.tabBar.comments, {
          [CLASSES.tabBar.activeTab]: props.activeTab === "COMMENTS",
        })}
        tabID="COMMENTS"
      >
        {props.mode === GQLSTORY_MODE.QA ? (
          <Localized id="general-tabBar-qaTab">
            <span>Q&A</span>
          </Localized>
        ) : (
          <Localized id="general-tabBar-commentsTab">
            <span>Comments</span>
          </Localized>
        )}
      </Tab>
      {props.showProfileTab && (
        <Tab
          className={cn(CLASSES.tabBar.myProfile, {
            [CLASSES.tabBar.activeTab]: props.activeTab === "PROFILE",
          })}
          tabID="PROFILE"
        >
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
