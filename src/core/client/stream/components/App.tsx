import * as React from "react";
import { StatelessComponent } from "react";
import TabBarQuery from "talk-stream/queries/TabBarQuery";
import { HorizontalGutter, TabContent, TabPane } from "talk-ui/components";

import CommentsPaneContainer from "../tabs/comments/containers/CommentsPaneContainer";
import ProfileQuery from "../tabs/profile/queries/ProfileQuery";

import styles from "./App.css";

type TabValue = "COMMENTS" | "PROFILE" | "%future added value";

export interface AppProps {
  activeTab: TabValue;
}

const App: StatelessComponent<AppProps> = props => {
  return (
    <HorizontalGutter className={styles.root}>
      <TabBarQuery />
      <TabContent activeTab={props.activeTab} className={styles.tabContent}>
        <TabPane tabId="COMMENTS" data-testid="current-tab-pane">
          <CommentsPaneContainer />
        </TabPane>
        <TabPane tabId="PROFILE" data-testid="current-tab-pane">
          <ProfileQuery />
        </TabPane>
      </TabContent>
    </HorizontalGutter>
  );
};

export default App;
