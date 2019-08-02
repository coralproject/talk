import React, { FunctionComponent, useCallback } from "react";

import { graphql, useLocal } from "coral-framework/lib/relay";
import { PropTypesOf } from "coral-framework/types";
import { ProfileLocal } from "coral-stream/__generated__/ProfileLocal.graphql";
import UserBoxContainer from "coral-stream/common/UserBox";
import {
  HorizontalGutter,
  Tab,
  TabBar,
  TabContent,
  TabPane,
} from "coral-ui/components";
import { Localized } from "fluent-react/compat";

import CommentHistoryContainer from "./CommentHistory";
import SettingsContainer from "./Settings";

export interface ProfileProps {
  story: PropTypesOf<typeof CommentHistoryContainer>["story"];
  viewer: PropTypesOf<typeof UserBoxContainer>["viewer"] &
    PropTypesOf<typeof CommentHistoryContainer>["viewer"] &
    PropTypesOf<typeof SettingsContainer>["viewer"];
  settings: PropTypesOf<typeof UserBoxContainer>["settings"] &
    PropTypesOf<typeof SettingsContainer>["settings"];
}

const Profile: FunctionComponent<ProfileProps> = props => {
  const [local, setLocal] = useLocal<ProfileLocal>(graphql`
    fragment ProfileLocal on Local {
      profileTab
    }
  `);
  const onTabClick = useCallback(
    (tab: ProfileLocal["profileTab"]) => setLocal({ profileTab: tab }),
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
        <Tab tabID="MY_COMMENTS">
          <Localized id="profile-myCommentsTab">
            <span>My Comments</span>
          </Localized>
        </Tab>
        <Tab tabID="SETTINGS">
          <Localized id="profile-settingsTab">
            <span>Settings</span>
          </Localized>
        </Tab>
      </TabBar>
      <TabContent activeTab={local.profileTab}>
        <TabPane tabID="MY_COMMENTS">
          <CommentHistoryContainer viewer={props.viewer} story={props.story} />
        </TabPane>
        <TabPane tabID="SETTINGS">
          <SettingsContainer viewer={props.viewer} settings={props.settings} />
        </TabPane>
      </TabContent>
    </HorizontalGutter>
  );
};

export default Profile;
