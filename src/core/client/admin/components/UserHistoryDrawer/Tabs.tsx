import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback, useState } from "react";

import {
  Flex,
  Icon,
  Tab,
  TabBar,
  TabContent,
  TabPane,
} from "coral-ui/components/v2";

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
  setUserID?: (id: string) => void;
}

const UserHistoryTabs: FunctionComponent<Props> = ({
  userID,
  notesCount,
  setUserID,
}) => {
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
          <Flex
            alignItems="center"
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
          </Flex>
        </Tab>
        <Tab tabID="REJECTED_COMMENTS" onTabClick={onTabChanged}>
          <Flex
            alignItems="center"
            className={cn(styles.tab, {
              [styles.activeTab]: currentTab === "REJECTED_COMMENTS",
            })}
          >
            <Icon size="sm" className={styles.tabIcon}>
              close
            </Icon>
            <Localized id="moderate-user-drawer-tab-rejected-comments">
              <span>Rejected</span>
            </Localized>
          </Flex>
        </Tab>
        <Tab tabID="NOTES" onTabClick={onTabChanged}>
          <Flex
            alignItems="center"
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
          </Flex>
        </Tab>
        <Tab tabID="ACCOUNT_HISTORY" onTabClick={onTabChanged}>
          <Flex
            className={cn(styles.tab, {
              [styles.activeTab]: currentTab === "ACCOUNT_HISTORY",
            })}
            alignItems="center"
          >
            <Icon size="sm" className={styles.tabIcon}>
              history
            </Icon>
            <Localized id="moderate-user-drawer-tab-account-history">
              <span>Account History</span>
            </Localized>
          </Flex>
        </Tab>
      </TabBar>
      <TabContent activeTab={currentTab} className={styles.tabContent}>
        <TabPane tabID="ALL_COMMENTS">
          <div className={styles.container}>
            <div className={styles.scrollable}>
              <UserHistoryDrawerAllCommentsQuery
                userID={userID}
                setUserID={setUserID}
              />
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
