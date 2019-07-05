import { Tab, TabBar, TabContent, TabPane } from "coral-ui/components";
import React, { FunctionComponent, useCallback, useState } from "react";

import UserHistoryAllCommentsContainer from "./UserHistoryAllCommentsContainer";

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
    <>
      <TabBar
        activeTab={currentTab}
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
          <div className={styles.comments}>
            <UserHistoryAllCommentsContainer userID={userID} />
          </div>
        </TabPane>
      </TabContent>
    </>
  );
};

export default UserHistoryTabs;
