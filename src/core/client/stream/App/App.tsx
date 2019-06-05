import { HorizontalGutter, TabContent, TabPane } from "coral-ui/components";
import * as React from "react";
import { FunctionComponent } from "react";

import Comments from "../tabs/Comments";
import Configure from "../tabs/Configure";
import Profile from "../tabs/Profile";
import TabBarQuery from "./TabBarQuery";

import styles from "./App.css";

type TabValue = "COMMENTS" | "PROFILE" | "%future added value";

export interface AppProps {
  activeTab: TabValue;
}

const App: FunctionComponent<AppProps> = props => {
  return (
    <HorizontalGutter className={styles.root}>
      <TabBarQuery />
      <TabContent activeTab={props.activeTab} className={styles.tabContent}>
        <TabPane tabID="COMMENTS" data-testid="current-tab-pane">
          <Comments />
        </TabPane>
        <TabPane tabID="PROFILE" data-testid="current-tab-pane">
          <Profile />
        </TabPane>
        <TabPane tabID="CONFIGURE" data-testid="current-tab-pane">
          <Configure />
        </TabPane>
      </TabContent>
    </HorizontalGutter>
  );
};

export default App;
