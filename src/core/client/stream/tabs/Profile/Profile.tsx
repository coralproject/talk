import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";

import { graphql, useLocal } from "coral-framework/lib/relay";
import { PropTypesOf } from "coral-framework/types";
import { ProfileLocal } from "coral-stream/__generated__/ProfileLocal.graphql";
import CLASSES from "coral-stream/classes";
import UserBoxContainer from "coral-stream/common/UserBox";
import {
  HorizontalGutter,
  Tab,
  TabBar,
  TabContent,
  TabPane,
} from "coral-ui/components";

import CommentHistoryContainer from "./CommentHistory";
import DeletionRequestCalloutContainer from "./DeletionRequest/DeletionRequestCalloutContainer";
import AccountSettingsContainer from "./Settings";

export interface ProfileProps {
  story: PropTypesOf<typeof CommentHistoryContainer>["story"];
  viewer: PropTypesOf<typeof UserBoxContainer>["viewer"] &
    PropTypesOf<typeof CommentHistoryContainer>["viewer"] &
    PropTypesOf<typeof AccountSettingsContainer>["viewer"] &
    PropTypesOf<typeof AccountSettingsContainer>["viewer"] &
    PropTypesOf<typeof DeletionRequestCalloutContainer>["viewer"] &
    PropTypesOf<typeof AccountSettingsContainer>["viewer"];
  settings: PropTypesOf<typeof UserBoxContainer>["settings"] &
    PropTypesOf<typeof AccountSettingsContainer>["settings"];
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
    <HorizontalGutter size="double">
      <TabBar
        variant="secondary"
        activeTab={local.profileTab}
        onTabClick={onTabClick}
        className={CLASSES.tabBarMyProfile.$root}
      >
        <Tab tabID="MY_COMMENTS" className={CLASSES.tabBarMyProfile.myComments}>
          <Localized id="profile-myCommentsTab">
            <span>My Comments</span>
          </Localized>
        </Tab>
        <Tab tabID="SETTINGS" className={CLASSES.tabBarMyProfile.settings}>
          <Localized id="profile-accountTab">
            <span>Account</span>
          </Localized>
        </Tab>
      </TabBar>
      <TabContent activeTab={local.profileTab}>
        <TabPane
          className={CLASSES.myCommentsTabPane.$root}
          tabID="MY_COMMENTS"
        >
          <CommentHistoryContainer viewer={props.viewer} story={props.story} />
        </TabPane>
        <TabPane className={CLASSES.settingsTabPane.$root} tabID="SETTINGS">
          <AccountSettingsContainer
            viewer={props.viewer}
            settings={props.settings}
          />
          <DeletionRequestCalloutContainer viewer={props.viewer} />
        </TabPane>
      </TabContent>
    </HorizontalGutter>
  );
};

export default Profile;
