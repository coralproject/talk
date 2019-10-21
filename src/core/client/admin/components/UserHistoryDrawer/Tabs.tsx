import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import {
  Flex,
  Icon,
  Tab,
  TabBar,
  TabContent,
  TabPane,
} from "coral-ui/components";

import UserDrawerAccountHistoryQuery from "./UserDrawerAccountHistoryQuery";
import UserDrawerNotesQuery from "./UserDrawerNotesQuery";
import UserHistoryDrawerAllCommentsQuery from "./UserHistoryDrawerAllCommentsQuery";
import UserHistoryDrawerRejectedCommentsQuery from "./UserHistoryDrawerRejectedCommentsQuery";

import styles from "./Tabs.css";

type UserTabs =
  | "ALL_COMMENTS"
  | "REJECTED_COMMENTS"
  | "ACCOUNT_HISTORY"
  | "NOTES";

interface Props {
  userID: string;
  notesCount: number;
}

const UserHistoryTabs: FunctionComponent<Props> = ({ userID, notesCount }) => {
  const [currentTab, setCurrentTab] = useState<UserTabs>("ALL_COMMENTS");

  const onTabChanged = useCallback(
    (tab: UserTabs) => {
      setCurrentTab(tab);
    },
    [setCurrentTab]
  );

  return (
    <div className={styles.root}>
      <TabBar
        activeTab={currentTab}
        variant="secondary"
        onTabClick={onTabChanged}
        className={styles.tabBar}
      >
        <Tab tabID="ALL_COMMENTS" onTabClick={onTabChanged}>
          <div
            className={cn(styles.tab, {
              [styles.activeTab]: currentTab === "ALL_COMMENTS",
            })}
          >
            <Icon size="sm" className={styles.tabIcon}>
              forum
            </Icon>
            <Localized id="moderate-user-drawer-tab-all-comments">
              <span>All Comments</span>
            </Localized>
          </div>
        </Tab>
        <Tab tabID="REJECTED_COMMENTS" onTabClick={onTabChanged}>
          <div
            className={cn(styles.tab, {
              [styles.activeTab]: currentTab === "REJECTED_COMMENTS",
            })}
          >
            <Icon size="sm" className={styles.tabIcon}>
              cancel
            </Icon>
            <Localized id="moderate-user-drawer-tab-rejected-comments">
              <span>Rejected</span>
            </Localized>
          </div>
        </Tab>
        <Tab tabID="NOTES" onTabClick={onTabChanged}>
          <div
            className={cn(styles.tab, {
              [styles.activeTab]: currentTab === "NOTES",
            })}
          >
            <Icon size="sm" className={styles.tabIcon}>
              subject
            </Icon>
            <Flex>
              <Localized id="moderate-user-drawer-tab-notes">
                <span>Notes</span>
              </Localized>
              {notesCount > 0 && <div className={styles.redDot} />}
            </Flex>
          </div>
        </Tab>
        <Tab tabID="ACCOUNT_HISTORY" onTabClick={onTabChanged}>
          <div
            className={cn(styles.tab, {
              [styles.activeTab]: currentTab === "ACCOUNT_HISTORY",
            })}
          >
            <Icon size="sm" className={styles.tabIcon}>
              history
            </Icon>
            <Localized id="moderate-user-drawer-tab-account-history">
              <span>Account History</span>
            </Localized>
          </div>
        </Tab>
      </TabBar>
      <TabContent activeTab={currentTab} className={styles.tabContent}>
        <TabPane tabID="ALL_COMMENTS">
          <div className={styles.container}>
            <div className={styles.scrollable}>
              <UserHistoryDrawerAllCommentsQuery userID={userID} />
            </div>
          </div>
        </TabPane>
        <TabPane tabID="REJECTED_COMMENTS">
          <div className={styles.container}>
            <div className={styles.scrollable}>
              <UserHistoryDrawerRejectedCommentsQuery userID={userID} />
            </div>
          </div>
        </TabPane>
        <TabPane tabID="ACCOUNT_HISTORY">
          <div className={styles.container}>
            <div className={styles.scrollable}>
              <UserDrawerAccountHistoryQuery userID={userID} />
            </div>
          </div>
        </TabPane>
        <TabPane tabID="NOTES">
          <div className={styles.container}>
            <div className={styles.scrollable}>
              <UserDrawerNotesQuery userID={userID} />
            </div>
          </div>
        </TabPane>
      </TabContent>
    </div>
  );
};

export default UserHistoryTabs;
