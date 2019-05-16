import TabBarQuery from "coral-stream/queries/TabBarQuery";
import { HorizontalGutter, TabContent, TabPane } from "coral-ui/components";
import * as React from "react";
import { FunctionComponent } from "react";

import CommentsPaneContainer from "../tabs/comments/containers/CommentsPaneContainer";
import ConfigureQuery from "../tabs/configure/queries/ConfigureQuery";
import ProfileQuery from "../tabs/profile/queries/ProfileQuery";

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
        <TabPane tabId="COMMENTS" data-testid="current-tab-pane">
          <CommentsPaneContainer />
        </TabPane>
        <TabPane tabId="PROFILE" data-testid="current-tab-pane">
          <ProfileQuery />
        </TabPane>
        <TabPane tabId="CONFIGURE" data-testid="current-tab-pane">
          <ConfigureQuery />
        </TabPane>
      </TabContent>
    </HorizontalGutter>
  );
};

export default App;
