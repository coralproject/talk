import cn from "classnames";
import React, { FunctionComponent, useEffect } from "react";
import { graphql } from "relay-runtime";

import useGetMessage from "coral-framework/lib/i18n/useGetMessage";
import { useInView } from "coral-framework/lib/intersection";
import { useLocal } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { LiveBellIcon } from "coral-stream/tabs/Notifications/LiveBellIcon";
import { MatchMedia, Tab, TabBar } from "coral-ui/components/v2";

import { TabBar_local } from "coral-stream/__generated__/TabBar_local.graphql";

import styles from "./TabBar.css";

type TabValue =
  | "COMMENTS"
  | "PROFILE"
  | "DISCUSSIONS"
  | "CONFIGURE"
  | "NOTIFICATIONS"
  | "%future added value";

export interface Props {
  activeTab: TabValue;
  onTabClick: (tab: TabValue) => void;
  showProfileTab: boolean;
  showDiscussionsTab: boolean;
  showConfigureTab: boolean;
  showNotificationsTab: boolean;
  hasNewNotifications: boolean;
  userNotificationsEnabled: boolean;
  inPageNotifications?: {
    enabled: boolean | null;
    floatingBellIndicator: boolean | null;
  } | null;
  mode:
    | "COMMENTS"
    | "QA"
    | "RATINGS_AND_REVIEWS"
    | "%future added value"
    | null;
}

const AppTabBar: FunctionComponent<Props> = (props) => {
  const [, setLocal] = useLocal<TabBar_local>(graphql`
    fragment TabBar_local on Local {
      appTabBarVisible
    }
  `);

  const { inView, intersectionRef } = useInView();
  useEffect(() => {
    setLocal({ appTabBarVisible: inView });
  }, [inView, setLocal]);

  const getMessage = useGetMessage();

  let commentsTabText: string;
  switch (props.mode) {
    case "QA":
      commentsTabText = getMessage("general-tabBar-qaTab", "Q&A");
      break;
    case "RATINGS_AND_REVIEWS":
      commentsTabText = getMessage("general-tabBar-reviewsTab", "Reviews");
      break;
    default:
      commentsTabText = getMessage("general-tabBar-commentsTab", "Comments");
  }
  const discussionsText = getMessage(
    "general-tabBar-discussionsTab",
    "Discussions"
  );
  const myProfileText = getMessage("general-tabBar-myProfileTab", "My Profile");
  const configureText = getMessage("general-tabBar-configure", "Configure");
  const notificationsText = getMessage("notifications-title", "Notifications");

  return (
    <MatchMedia gteWidth="sm">
      {(matches) => (
        <TabBar
          className={cn(CLASSES.tabBar.$root, {
            [CLASSES.tabBar.mobile]: !matches,
          })}
          activeTab={props.activeTab}
          onTabClick={props.onTabClick}
          variant="streamPrimary"
          forwardRef={intersectionRef}
        >
          <Tab
            className={cn(CLASSES.tabBar.comments, {
              [CLASSES.tabBar.activeTab]: props.activeTab === "COMMENTS",
              [styles.smallTab]: !matches,
            })}
            tabID="COMMENTS"
            variant="streamPrimary"
          >
            <span>{commentsTabText}</span>
          </Tab>

          {props.showDiscussionsTab && (
            <Tab
              className={cn(CLASSES.tabBar.discussions, {
                [CLASSES.tabBar.activeTab]: props.activeTab === "DISCUSSIONS",
                [styles.smallTab]: !matches,
              })}
              tabID="DISCUSSIONS"
              variant="streamPrimary"
            >
              <span>{discussionsText}</span>
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
            >
              <span>{myProfileText}</span>
            </Tab>
          )}

          {props.showConfigureTab && (
            <Tab
              className={cn(CLASSES.tabBar.configure, {
                [CLASSES.tabBar.activeTab]: props.activeTab === "CONFIGURE",
                [styles.smallTab]: !matches,
              })}
              tabID="CONFIGURE"
              variant="streamPrimary"
            >
              <span>{configureText}</span>
            </Tab>
          )}

          {props.showNotificationsTab && (
            <Tab
              className={cn(
                CLASSES.tabBar.notifications,
                styles.notificationsTab,
                {
                  [CLASSES.tabBar.activeTab]:
                    props.activeTab === "NOTIFICATIONS",
                  [styles.notificationsTabSmall]: !matches,
                  [styles.floatingBellDisabled]:
                    !props.inPageNotifications?.floatingBellIndicator,
                }
              )}
              tabID="NOTIFICATIONS"
              variant="notifications"
              float={
                props.inPageNotifications?.floatingBellIndicator
                  ? "right"
                  : "none"
              }
              title={notificationsText}
            >
              <div className={cn(styles.notificationsIcon)}>
                <LiveBellIcon
                  size="lg"
                  enabled={props.userNotificationsEnabled}
                />
              </div>
            </Tab>
          )}
        </TabBar>
      )}
    </MatchMedia>
  );
};

export default AppTabBar;
