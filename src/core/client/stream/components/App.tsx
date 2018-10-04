import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";
import {
  HorizontalGutter,
  Tab,
  TabBar,
  TabContent,
  TabPane,
} from "talk-ui/components";

import { PropTypesOf } from "talk-ui/types";
import IfLoggedInContainer from "../containers/IfLoggedInContainer";
import CommentsPaneContainer from "../tabs/comments/containers/CommentsPaneContainer";
import ProfileQuery from "../tabs/profile/queries/ProfileQuery";
import * as styles from "./App.css";

type TabValue = "COMMENTS" | "PROFILE" | "%future added value";

export interface AppProps {
  activeTab: TabValue;
  onTabClick: (tab: TabValue) => void;
  commentCount: number;
}

interface CommentsTabProps extends PropTypesOf<typeof Tab> {
  commentCount: number;
}

const CommentsTab: StatelessComponent<CommentsTabProps> = props => (
  <Localized id="general-app-commentsTab" $commentCount={props.commentCount}>
    <Tab {...props}>{"{$commentCount} Comments"}</Tab>
  </Localized>
);

const MyProfileTab: StatelessComponent<PropTypesOf<typeof Tab>> = props => (
  <IfLoggedInContainer>
    <Localized id="general-app-myProfileTab">
      <Tab {...props}>My Profile</Tab>
    </Localized>
  </IfLoggedInContainer>
);

const App: StatelessComponent<AppProps> = props => {
  return (
    <HorizontalGutter className={styles.root}>
      <TabBar activeTab={props.activeTab} onTabClick={props.onTabClick}>
        <CommentsTab tabId="COMMENTS" commentCount={props.commentCount} />
        <MyProfileTab tabId="PROFILE" />
      </TabBar>
      <TabContent activeTab={props.activeTab} className={styles.tabContent}>
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
