import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { GQLSTORY_MODE } from "coral-framework/schema";
import CLASSES from "coral-stream/classes";
import { Icon, MatchMedia, Tab, TabBar } from "coral-ui/components/v2";

import styles from "./TabBar.css";

type TabValue = "COMMENTS" | "PROFILE" | "%future added value";

export interface Props {
  activeTab: TabValue;
  onTabClick: (tab: TabValue) => void;
  showProfileTab: boolean;
  showConfigureTab: boolean;
  mode: "%future added value" | "COMMENTS" | "QA" | null;
}

const AppTabBar: FunctionComponent<Props> = (props) => {
  return (
    <TabBar
      className={CLASSES.tabBar.$root}
      activeTab={props.activeTab}
      onTabClick={props.onTabClick}
      variant="streamPrimary"
    >
      <Tab
        className={cn(CLASSES.tabBar.comments, {
          [CLASSES.tabBar.activeTab]: props.activeTab === "COMMENTS",
        })}
        tabID="COMMENTS"
        variant="streamPrimary"
        ariaLabel={props.mode === GQLSTORY_MODE.QA ? "Q&A" : "Comments"}
      >
        <MatchMedia gteWidth="sm">
          {(matches) =>
            matches ? (
              props.mode === GQLSTORY_MODE.QA ? (
                <Localized id="general-tabBar-qaTab">
                  <span>Q&A</span>
                </Localized>
              ) : (
                <Localized id="general-tabBar-commentsTab">
                  <span>Comments</span>
                </Localized>
              )
            ) : (
              <div>
                <Icon
                  size="lg"
                  aria-label={
                    props.mode === GQLSTORY_MODE.QA ? "Q&A" : "Comments"
                  }
                >
                  {props.mode === GQLSTORY_MODE.QA ? "live_help" : "forum"}
                </Icon>
                {props.mode === GQLSTORY_MODE.QA ? (
                  <Localized id="general-tabBar-qaTab">
                    <div className={styles.smallText}>Q&A</div>
                  </Localized>
                ) : (
                  <Localized id="general-tabBar-commentsTab">
                    <div className={styles.smallText}>Comments</div>
                  </Localized>
                )}
              </div>
            )
          }
        </MatchMedia>
      </Tab>
      {props.showProfileTab && (
        <Tab
          className={cn(CLASSES.tabBar.myProfile, {
            [CLASSES.tabBar.activeTab]: props.activeTab === "PROFILE",
          })}
          tabID="PROFILE"
          variant="streamPrimary"
          ariaLabel="My Profile"
        >
          <MatchMedia gteWidth="sm">
            {(matches) =>
              matches ? (
                <Localized id="general-tabBar-myProfileTab">
                  <span>My Profile</span>
                </Localized>
              ) : (
                <div>
                  <Icon size="lg" aria-label="My Profile">
                    account_circle
                  </Icon>
                  <Localized id="general-tabBar-myProfileTab">
                    <div className={styles.smallText}>My Profile</div>
                  </Localized>
                </div>
              )
            }
          </MatchMedia>
        </Tab>
      )}
      {props.showConfigureTab && (
        <Tab
          className={CLASSES.tabBar.configure}
          tabID="CONFIGURE"
          variant="streamPrimary"
          ariaLabel="Configure"
        >
          <MatchMedia gteWidth="sm">
            {(matches) =>
              matches ? (
                <Localized id="general-tabBar-configure">
                  <span>Configure</span>
                </Localized>
              ) : (
                <div>
                  <Icon size="lg" aria-label="Configure">
                    settings
                  </Icon>
                  <Localized id="general-tabBar-configure">
                    <div className={styles.smallText}>Configure</div>
                  </Localized>
                </div>
              )
            }
          </MatchMedia>
        </Tab>
      )}
    </TabBar>
  );
};

export default AppTabBar;
