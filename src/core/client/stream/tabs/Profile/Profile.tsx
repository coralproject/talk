import React, { FunctionComponent, useCallback, useState } from "react";

import { PropTypesOf } from "coral-framework/types";
import UserBoxContainer from "coral-stream/common/UserBox";
import {
  HorizontalGutter,
  Tab,
  TabBar,
  TabContent,
  TabPane,
} from "coral-ui/components";

import CommentHistoryContainer from "./CommentHistory";
import SettingsContainer from "./Settings";

export interface ProfileProps {
  story: PropTypesOf<typeof CommentHistoryContainer>["story"];
  viewer: PropTypesOf<typeof UserBoxContainer>["viewer"] &
    PropTypesOf<typeof CommentHistoryContainer>["viewer"] &
    PropTypesOf<typeof SettingsContainer>["viewer"];
  settings: PropTypesOf<typeof UserBoxContainer>["settings"];
}

const Profile: FunctionComponent<ProfileProps> = props => {
  const [activeTab, setActiveTab] = useState<string>("profile-myComments");
  const onTabClick = useCallback((tab: string) => setActiveTab(tab), [
    setActiveTab,
  ]);
  return (
    <HorizontalGutter spacing={5}>
      <UserBoxContainer viewer={props.viewer} settings={props.settings} />
      <TabBar variant="secondary" activeTab={activeTab} onTabClick={onTabClick}>
        <Tab tabID="profile-myComments">My Comments</Tab>
        <Tab tabID="profile-settings">Settings</Tab>
      </TabBar>
      <TabContent activeTab={activeTab}>
        <TabPane tabID="profile-myComments">
          <CommentHistoryContainer viewer={props.viewer} story={props.story} />
        </TabPane>
        <TabPane tabID="profile-settings">
          <SettingsContainer viewer={props.viewer} />
        </TabPane>
      </TabContent>
    </HorizontalGutter>
  );
};

export default Profile;
