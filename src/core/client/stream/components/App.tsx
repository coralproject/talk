import * as React from "react";
import { StatelessComponent } from "react";

import {
  HorizontalGutter,
  Tab,
  TabBar,
  TabContent,
  TabPane,
} from "talk-ui/components";

import CommentsPaneContainer from "../tabs/comments/containers/CommentsPaneContainer";
import * as styles from "./App.css";

export interface AppProps {
  activeTab: "COMMENTS" | "%future added value";
}

const App: StatelessComponent<AppProps> = props => {
  return (
    <HorizontalGutter className={styles.root}>
      <TabBar activeTab={props.activeTab}>
        <Tab tabId="COMMENTS">Comments</Tab>
        <Tab tabId="PROFILE">My Profile</Tab>
      </TabBar>
      <TabContent activeTab={props.activeTab}>
        <TabPane tabId="COMMENTS">
          <CommentsPaneContainer />
        </TabPane>
        <TabPane tabId="PROFILE">My profileeeeee</TabPane>
      </TabContent>
    </HorizontalGutter>
  );
};

export default App;
