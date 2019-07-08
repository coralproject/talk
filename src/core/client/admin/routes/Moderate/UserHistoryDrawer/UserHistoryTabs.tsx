import { Tab, TabBar, TabContent, TabPane } from "coral-ui/components";
import React, { FunctionComponent, useCallback, useState } from "react";

import UserHistoryAllCommentsContainer from "./UserHistoryAllCommentsContainer";
import UserHistoryRejectedCommentsContainer from "./UserHistoryRejectedCommentsContainer";

import styles from "./UserHistoryTabs.css";

interface Props {
  userID: string;
}

const UserHistoryTabs: FunctionComponent<Props> = ({ userID }) => {
  const [currentTab, setCurrentTab] = useState("ALL");

  const onTabChanged = useCallback(
    (tab: any) => {
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
        <Tab tabID={"ALL"} onTabClick={onTabChanged}>
          <span>All Comments</span>
        </Tab>
        <Tab tabID={"REJECTED"} onTabClick={onTabChanged}>
          <span>Rejected</span>
        </Tab>
      </TabBar>
      <TabContent activeTab={currentTab} className={styles.tabContent}>
        <TabPane tabID="ALL">
          <div className={styles.container}>
            <div className={styles.scrollable}>
              <UserHistoryAllCommentsContainer userID={userID} />
            </div>
          </div>
        </TabPane>
        <TabPane tabID="REJECTED">
          <div className={styles.container}>
            <div className={styles.scrollable}>
              <UserHistoryRejectedCommentsContainer userID={userID} />
            </div>
          </div>
        </TabPane>
      </TabContent>
    </div>
  );
};

export default UserHistoryTabs;
