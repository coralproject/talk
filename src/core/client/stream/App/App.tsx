import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import {
  AriaInfo,
  HorizontalGutter,
  TabContent,
  TabPane,
} from "coral-ui/components";

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
    <HorizontalGutter className={cn(CLASSES.app, styles.root)}>
      <nav>
        <AriaInfo component="h2">Navigation</AriaInfo>
        <TabBarQuery />
      </nav>
      <main>
        <TabContent activeTab={props.activeTab} className={styles.tabContent}>
          <TabPane
            className={CLASSES.commentsTabPane.$root}
            tabID="COMMENTS"
            data-testid="current-tab-pane"
          >
            <Comments />
          </TabPane>
          <TabPane
            className={CLASSES.myProfileTabPane.$root}
            tabID="PROFILE"
            data-testid="current-tab-pane"
          >
            <Profile />
          </TabPane>
          <TabPane
            className={CLASSES.configureTabPane.$root}
            tabID="CONFIGURE"
            data-testid="current-tab-pane"
          >
            <Configure />
          </TabPane>
        </TabContent>
      </main>
    </HorizontalGutter>
  );
};

export default App;
