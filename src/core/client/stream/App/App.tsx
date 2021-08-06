import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { HorizontalGutter, TabContent, TabPane } from "coral-ui/components/v2";

import Comments from "../tabs/Comments";
import Configure from "../tabs/Configure";
import Discussions from "../tabs/Discussions";
import Profile from "../tabs/Profile";
import TabBarQuery from "./TabBarQuery";

import styles from "./App.css";

type TabValue = "COMMENTS" | "PROFILE" | "DISCUSSIONS" | "%future added value";

export interface AppProps {
  activeTab: TabValue;
}

const App: FunctionComponent<AppProps> = (props) => {
  return (
    <Localized id="general-commentsEmbedSection" attrs={{ "aria-label": true }}>
      <HorizontalGutter
        className={cn(CLASSES.app, styles.root)}
        container="main"
        aria-label="Comments Embed"
      >
        <Localized id="general-mainTablist" attrs={{ "aria-label": true }}>
          <nav aria-label="Main Tablist">
            <TabBarQuery />
          </nav>
        </Localized>
        <div>
          <TabContent activeTab={props.activeTab} className={styles.tabContent}>
            <TabPane
              className={CLASSES.commentsTabPane.$root}
              tabID="COMMENTS"
              data-testid="current-tab-pane"
            >
              <Comments />
            </TabPane>
            <TabPane
              className={CLASSES.discussionsTabPane.$root}
              tabID="DISCUSSIONS"
              data-testid="current-tab-pane"
            >
              <Discussions />
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
        </div>
      </HorizontalGutter>
    </Localized>
  );
};

export default App;
