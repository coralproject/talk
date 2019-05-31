import React, { FunctionComponent, useCallback } from "react";

import { PropTypesOf } from "coral-framework/types";
import { ProfileLocal as Local } from "coral-stream/__generated__/ProfileLocal.graphql";
import UserBoxContainer from "coral-stream/common/UserBox";
import {
  HorizontalGutter,
  Tab,
  TabBar,
  TabContent,
  TabPane,
} from "coral-ui/components";

import { graphql, useLocal } from "coral-framework/lib/relay";
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
  const [local, setLocal] = useLocal<Local>(graphql`
    fragment ProfileLocal on Local {
      profileTab
    }
  `);
  const onTabClick = useCallback(
    (tab: Local["profileTab"]) => setLocal({ profileTab: tab }),
    [setLocal]
  );
  return (
    <HorizontalGutter spacing={5}>
      <UserBoxContainer viewer={props.viewer} settings={props.settings} />
      <TabBar
        variant="secondary"
        activeTab={local.profileTab}
        onTabClick={onTabClick}
      >
        <Tab tabID="MY_COMMENTS">My Comments</Tab>
        <Tab tabID="SETTINGS">Settings</Tab>
      </TabBar>
      <TabContent activeTab={local.profileTab}>
        <TabPane tabID="MY_COMMENTS">
          <CommentHistoryContainer viewer={props.viewer} story={props.story} />
        </TabPane>
        <TabPane tabID="SETTINGS">
          <SettingsContainer viewer={props.viewer} />
        </TabPane>
      </TabContent>
    </HorizontalGutter>
  );
};

export default Profile;
