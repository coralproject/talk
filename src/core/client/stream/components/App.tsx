import * as React from "react";
import { StatelessComponent } from "react";

import {
  HorizontalGutter,
  Tab,
  TabBar,
  TabContent,
  TabPane,
} from "talk-ui/components";

import { SetActiveTabMutation } from "talk-stream/mutations";

import CommentsPaneContainer from "../tabs/comments/containers/CommentsPaneContainer";
import ProfileQuery from "../tabs/profile/queries/ProfileQuery";
import * as styles from "./App.css";

export interface AppProps {
  activeTab: "COMMENTS" | "PROFILE" | "%future added value" | string;
  onActiveTab: SetActiveTabMutation;
}

const App: StatelessComponent<AppProps> = props => {
  return (
    <HorizontalGutter className={styles.root}>
      <TabBar
        activeTab={props.activeTab}
        onTabClick={tab => props.onActiveTab({ tab })}
      >
        <Tab tabId="COMMENTS">Comments</Tab>
        <Tab tabId="PROFILE">My Profile</Tab>
      </TabBar>
      <TabContent activeTab={props.activeTab}>
        <TabPane tabId="COMMENTS">
          <CommentsPaneContainer />
        </TabPane>
        <TabPane tabId="PROFILE">
          <ProfileQuery />
        </TabPane>
      </TabContent>
    </HorizontalGutter>
  );
};

export default App;
