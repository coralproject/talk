import cn from "classnames";
import React, { FunctionComponent } from "react";

import useGetMessage from "coral-framework/lib/i18n/useGetMessage";
import { GQLSTORY_MODE } from "coral-framework/schema";
import CLASSES from "coral-stream/classes";
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
          >
            {matches ? (
              <span>{commentsTabText}</span>
            ) : (
              <div>
                {!props.mode ||
                  (props.mode === GQLSTORY_MODE.COMMENTS && (
                    <>
                      <Icon size="lg">forum</Icon>
                      <div className={styles.smallText}>{commentsTabText}</div>
                    </>
                  ))}
                {props.mode === GQLSTORY_MODE.QA && (
                  <>
                    <Icon size="lg">live_help</Icon>
                    <div className={styles.smallText}>{commentsTabText}</div>
                  </>
                )}
                {props.mode === GQLSTORY_MODE.RATINGS_AND_REVIEWS && (
                  <>
                    <Icon size="lg">star</Icon>
                    <div className={styles.smallText}>{commentsTabText}</div>
                  </>
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
            >
              {matches ? (
                <span>{discussionsText}</span>
              ) : (
                <div>
                  <Icon size="lg">list_alt</Icon>
                  <div className={styles.smallText}>{discussionsText}</div>
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
            >
              {matches ? (
                <span>{myProfileText}</span>
              ) : (
                <div>
                  <Icon size="lg">account_circle</Icon>
                  <div className={styles.smallText}>{myProfileText}</div>
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
            >
              {matches ? (
                <span>{configureText}</span>
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
