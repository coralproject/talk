import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback, useMemo } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useViewerEvent } from "coral-framework/lib/events";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import UserBoxContainer from "coral-stream/common/UserBox";
import { SetProfileTabEvent } from "coral-stream/events";
import { useStreamLocal } from "coral-stream/local/StreamLocal";
import {
  HorizontalGutter,
  Tab,
  TabBar,
  TabContent,
  TabPane,
} from "coral-ui/components/v2";

import DeletionRequestCalloutContainer from "./DeletionRequest/DeletionRequestCalloutContainer";
import MyCommentsContainer from "./MyComments";
import PreferencesContainer from "./Preferences";
import AccountSettingsContainer from "./Settings";

export interface ProfileProps {
  isSSO: boolean;
  ssoURL: string | null;
  story: PropTypesOf<typeof MyCommentsContainer>["story"];
  viewer: PropTypesOf<typeof UserBoxContainer>["viewer"] &
    PropTypesOf<typeof MyCommentsContainer>["viewer"] &
    PropTypesOf<typeof AccountSettingsContainer>["viewer"] &
    PropTypesOf<typeof DeletionRequestCalloutContainer>["viewer"] &
    PropTypesOf<typeof PreferencesContainer>["viewer"];
  settings: PropTypesOf<typeof UserBoxContainer>["settings"] &
    PropTypesOf<typeof AccountSettingsContainer>["settings"] &
    PropTypesOf<typeof MyCommentsContainer>["settings"] &
    PropTypesOf<typeof PreferencesContainer>["settings"];
}

export type PROFILE_TAB =
  | "ACCOUNT"
  | "MY_COMMENTS"
  | "PREFERENCES"
  | "%future added value";

const Profile: FunctionComponent<ProfileProps> = (props) => {
  const { window } = useCoralContext();
  const emitSetProfileTabEvent = useViewerEvent(SetProfileTabEvent);
  const { profileTab, setProfileTab } = useStreamLocal();

  const onTabClick = useCallback(
    (tab: PROFILE_TAB) => {
      if (
        tab === "ACCOUNT" &&
        props.isSSO &&
        props.ssoURL &&
        props.ssoURL.length > 0
      ) {
        window.open(props.ssoURL);
      } else if (profileTab !== tab) {
        emitSetProfileTabEvent({ tab });
        setProfileTab(tab);
      }
    },
    [
      props.isSSO,
      props.ssoURL,
      profileTab,
      window,
      emitSetProfileTabEvent,
      setProfileTab,
    ]
  );

  const showAccountTab = useMemo(() => {
    if (!props.isSSO) {
      return true;
    }
    if (props.ssoURL) {
      return true;
    }
    return false;
  }, [props.ssoURL, props.isSSO]);

  return (
    <HorizontalGutter size="double">
      <UserBoxContainer viewer={props.viewer} settings={props.settings} />
      <DeletionRequestCalloutContainer viewer={props.viewer} />
      <Localized id="general-secondaryTablist" attrs={{ "aria-label": true }}>
        <nav aria-label="Secondary Tablist">
          <TabBar
            variant="streamSecondary"
            activeTab={profileTab}
            onTabClick={onTabClick}
            className={CLASSES.tabBarMyProfile.$root}
          >
            <Tab
              tabID="MY_COMMENTS"
              variant="streamSecondary"
              className={cn(CLASSES.tabBarMyProfile.myComments, {
                [CLASSES.tabBarMyProfile.active]: profileTab === "MY_COMMENTS",
              })}
            >
              <Localized id="profile-myCommentsTab-comments">
                <span>My comments</span>
              </Localized>
            </Tab>
            <Tab
              tabID="PREFERENCES"
              variant="streamSecondary"
              className={cn(CLASSES.tabBarMyProfile.preferences, {
                [CLASSES.tabBarMyProfile.active]: profileTab === "PREFERENCES",
              })}
            >
              <Localized id="profile-preferencesTab">
                <span>Preferences</span>
              </Localized>
            </Tab>
            {showAccountTab && (
              <Tab
                tabID="ACCOUNT"
                variant="streamSecondary"
                className={cn(CLASSES.tabBarMyProfile.settings, {
                  [CLASSES.tabBarMyProfile.active]: profileTab === "ACCOUNT",
                })}
              >
                <Localized id="profile-accountTab">
                  <span>Account</span>
                </Localized>
              </Tab>
            )}
          </TabBar>
        </nav>
      </Localized>
      <TabContent activeTab={profileTab}>
        <TabPane
          className={CLASSES.myCommentsTabPane.$root}
          tabID="MY_COMMENTS"
        >
          <MyCommentsContainer
            settings={props.settings}
            viewer={props.viewer}
            story={props.story}
          />
        </TabPane>
        <TabPane
          className={CLASSES.preferencesTabPane.$root}
          tabID="PREFERENCES"
        >
          <PreferencesContainer
            viewer={props.viewer}
            settings={props.settings}
          />
        </TabPane>
        {showAccountTab && (
          <TabPane className={CLASSES.accountTabPane.$root} tabID="ACCOUNT">
            <AccountSettingsContainer
              viewer={props.viewer}
              settings={props.settings}
            />
          </TabPane>
        )}
      </TabContent>
    </HorizontalGutter>
  );
};

export default Profile;
