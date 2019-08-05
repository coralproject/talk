import { HorizontalGutter, TabContent, TabPane } from "coral-ui/components";
import React, { FunctionComponent } from "react";

import Comments from "../tabs/Comments";
import Configure from "../tabs/Configure";
import Profile from "../tabs/Profile";
import TabBarQuery from "./TabBarQuery";

import { useResizeObserver } from "coral-framework/hooks";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import styles from "./App.css";

type TabValue = "COMMENTS" | "PROFILE" | "%future added value";

export interface AppProps {
  activeTab: TabValue;
}

const App: FunctionComponent<AppProps> = props => {
  // Send height to parent after a resize.
  const { pym } = useCoralContext();
  const ref = useResizeObserver(entry => {
    if (pym) {
      pym.sendMessage("height", entry.contentRect.height.toString());
    }
  });

  return (
    <HorizontalGutter className={styles.root} ref={ref}>
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
