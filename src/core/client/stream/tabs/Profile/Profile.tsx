import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";

import { graphql, useLocal } from "coral-framework/lib/relay";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import UserBoxContainer from "coral-stream/common/UserBox";
import {
  HorizontalGutter,
  Tab,
  TabBar,
  TabContent,
  TabPane,
} from "coral-ui/components";

import { ProfileLocal } from "coral-stream/__generated__/ProfileLocal.graphql";

import CommentHistoryContainer from "./CommentHistory";
import DeletionRequestCalloutContainer from "./DeletionRequest/DeletionRequestCalloutContainer";
import AccountSettingsContainer from "./Settings";
import NotificationSettingsContainer from "./Settings/NotificationSettingsContainer";

export interface ProfileProps {
  story: PropTypesOf<typeof CommentHistoryContainer>["story"];
  viewer: PropTypesOf<typeof UserBoxContainer>["viewer"] &
    PropTypesOf<typeof CommentHistoryContainer>["viewer"] &
    PropTypesOf<typeof AccountSettingsContainer>["viewer"] &
    PropTypesOf<typeof AccountSettingsContainer>["viewer"] &
    PropTypesOf<typeof DeletionRequestCalloutContainer>["viewer"] &
    PropTypesOf<typeof AccountSettingsContainer>["viewer"] &
    PropTypesOf<typeof NotificationSettingsContainer>["viewer"];
  settings: PropTypesOf<typeof UserBoxContainer>["settings"] &
    PropTypesOf<typeof AccountSettingsContainer>["settings"] &
    PropTypesOf<typeof CommentHistoryContainer>["settings"];
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
      <UserBoxContainer viewer={props.viewer} settings={props.settings} />
      <TabBar
        variant="secondary"
        activeTab={local.profileTab}
        onTabClick={onTabClick}
        className={CLASSES.tabBarMyProfile.$root}
      >
        <Tab tabID="MY_COMMENTS" className={CLASSES.tabBarMyProfile.myComments}>
          <Localized id="profile-myCommentsTab-comments">
            <span>My comments</span>
          </Localized>
        </Tab>
        <Tab
          tabID="NOTIFICATIONS"
          className={CLASSES.tabBarMyProfile.notifications}
        >
          <Localized id="profile-notificationsTab">
            <span>Notifications</span>
          </Localized>
        </Tab>
        <Tab tabID="ACCOUNT" className={CLASSES.tabBarMyProfile.settings}>
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
          <CommentHistoryContainer
            settings={props.settings}
            viewer={props.viewer}
            story={props.story}
          />
        </TabPane>
        <TabPane
          className={CLASSES.notificationsTabPane.$root}
          tabID="NOTIFICATIONS"
        >
          <NotificationSettingsContainer viewer={props.viewer} />
        </TabPane>
        <TabPane className={CLASSES.accountTabPane.$root} tabID="ACCOUNT">
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
