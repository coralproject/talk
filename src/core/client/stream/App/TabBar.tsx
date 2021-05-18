import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { GQLSTORY_MODE } from "coral-stream/schema";
import { Icon, MatchMedia, Tab, TabBar } from "coral-ui/components/v2";

import styles from "./TabBar.css";

type TabValue = "COMMENTS" | "PROFILE" | "DISCUSSIONS" | "%future added value";

export interface Props {
  activeTab: TabValue;
  onTabClick: (tab: TabValue) => void;
  showProfileTab: boolean;
  showDiscussionsTab: boolean;
  showConfigureTab: boolean;
  mode:
    | "COMMENTS"
    | "QA"
    | "RATINGS_AND_REVIEWS"
    | "%future added value"
    | null;
}

const AppTabBar: FunctionComponent<Props> = (props) => {
  return (
    <MatchMedia gteWidth="sm">
      {(matches) => (
        <TabBar
          className={CLASSES.tabBar.$root}
          activeTab={props.activeTab}
          onTabClick={props.onTabClick}
          variant="streamPrimary"
        >
          <Tab
            className={cn(CLASSES.tabBar.comments, {
              [CLASSES.tabBar.activeTab]: props.activeTab === "COMMENTS",
              [styles.smallTab]: !matches,
            })}
            tabID="COMMENTS"
            variant="streamPrimary"
            localizationId={
              props.mode === GQLSTORY_MODE.QA
                ? "general-tabBar-aria-qa"
                : "general-tabBar-aria-comments"
            }
          >
            {matches ? (
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
                <Icon size="lg">
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
            )}
          </Tab>

          {props.showDiscussionsTab && (
            <Tab
              className={cn(CLASSES.tabBar.discussions, {
                [CLASSES.tabBar.activeTab]: props.activeTab === "DISCUSSIONS",
                [styles.smallTab]: !matches,
              })}
              tabID="DISCUSSIONS"
              variant="streamPrimary"
              localizationId="general-tabBar-aria-discussions"
            >
              {matches ? (
                <Localized id="general-tabBar-discussionsTab">
                  <span>Discussions</span>
                </Localized>
              ) : (
                <div>
                  <Icon size="lg">list_alt</Icon>
                  <Localized id="general-tabBar-discussionsTab">
                    <div className={styles.smallText}>Discussions</div>
                  </Localized>
                </div>
              )}
            </Tab>
          )}

          {props.showProfileTab && (
            <Tab
              className={cn(CLASSES.tabBar.myProfile, {
                [CLASSES.tabBar.activeTab]: props.activeTab === "PROFILE",
                [styles.smallTab]: !matches,
              })}
              tabID="PROFILE"
              variant="streamPrimary"
              localizationId="general-tabBar-aria-myProfile"
            >
              {matches ? (
                <Localized id="general-tabBar-myProfileTab">
                  <span>My Profile</span>
                </Localized>
              ) : (
                <div>
                  <Icon size="lg">account_circle</Icon>
                  <Localized id="general-tabBar-myProfileTab">
                    <div className={styles.smallText}>My Profile</div>
                  </Localized>
                </div>
              )}
            </Tab>
          )}

          {props.showConfigureTab && (
            <Tab
              className={cn(CLASSES.tabBar.configure, styles.configureTab, {
                [styles.smallTab]: !matches,
              })}
              tabID="CONFIGURE"
              variant="streamPrimary"
              localizationId="general-tabBar-aria-configure"
            >
              {matches ? (
                <Localized id="general-tabBar-configure">
                  <span>Configure</span>
                </Localized>
              ) : (
                <div>
                  <Icon size="md">settings</Icon>
                </div>
              )}
            </Tab>
          )}
        </TabBar>
      )}
    </MatchMedia>
  );
};

export default AppTabBar;
