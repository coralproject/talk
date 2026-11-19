import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap/CoralContext";
import CLASSES from "coral-stream/classes";
import NotificationsQuery from "coral-stream/tabs/Notifications/NotificationsQuery";
import { HorizontalGutter, TabContent, TabPane } from "coral-ui/components/v2";

import { useUIContext } from "coral-ui/components/v2/UIContext/UIContext";

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

const ShadowDirSync: FunctionComponent = () => {
  const { dir } = useUIContext();
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (ref.current && dir) {
      const rootNode = ref.current.getRootNode() as ShadowRoot | Document;
      if (rootNode) {
        const coralDiv = rootNode.querySelector("#coral");
        if (coralDiv) {
          coralDiv.setAttribute("dir", dir);
        }
        if ("host" in rootNode && rootNode.host) {
          (rootNode.host as HTMLElement).setAttribute("dir", dir);
        }
      }
    }
  }, [dir]);
  return <div ref={ref} style={{ display: "none" }} data-testid="shadow-dir-sync" />;
};

const App: FunctionComponent<AppProps> = (props) => {
  const { browserInfo } = useCoralContext();

  return (
    <Localized id="general-commentsEmbedSection" attrs={{ "aria-label": true }}>
      <HorizontalGutter
        className={cn(CLASSES.app, styles.root, {
          // TODO: (cvle) We disable transitions on ios devices to help with performance issues on large streams.
          // Remove when we introduced virtualised rendering.
          [styles.disableTransitions]: browserInfo.ios || browserInfo.iPadOS,
        })}
        container="main"
        aria-label="Comments Embed"
      >
        <ShadowDirSync />
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
            <TabPane
              className={CLASSES.notificationsTabPane.$root}
              tabID="NOTIFICATIONS"
              data-testid="current-tab-pane"
            >
              <NotificationsQuery />
            </TabPane>
          </TabContent>
        </div>
      </HorizontalGutter>
    </Localized>
  );
};

export default App;
