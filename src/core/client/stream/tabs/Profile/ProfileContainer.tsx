import { isUndefined } from "lodash";
import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { ProfileContainer_settings$key as SettingsData } from "coral-stream/__generated__/ProfileContainer_settings.graphql";
import { ProfileContainer_story$key as StoryData } from "coral-stream/__generated__/ProfileContainer_story.graphql";
import { ProfileContainer_viewer$key as ViewerData } from "coral-stream/__generated__/ProfileContainer_viewer.graphql";

import Profile from "./Profile";

interface ProfileContainerProps {
  viewer: ViewerData;
  settings: SettingsData;
  story: StoryData;
}

export const ProfileContainer: FunctionComponent<ProfileContainerProps> = ({
  viewer,
  settings,
  story,
}) => {
  const storyData = useFragment(
    graphql`
      fragment ProfileContainer_story on Story {
        ...MyCommentsContainer_story
      }
    `,
    story
  );
  const viewerData = useFragment(
    graphql`
      fragment ProfileContainer_viewer on User {
        ...UserBoxContainer_viewer
        ...AccountSettingsContainer_viewer
        ...MyCommentsContainer_viewer
        ...DeletionRequestCalloutContainer_viewer
        ...PreferencesContainer_viewer
        profiles {
          __typename
        }
        ssoURL
      }
    `,
    viewer
  );
  const settingsData = useFragment(
    graphql`
      fragment ProfileContainer_settings on Settings {
        ...UserBoxContainer_settings
        ...AccountSettingsContainer_settings
        ...MyCommentsContainer_settings
        ...PreferencesContainer_settings
      }
    `,
    settings
  );

  const ssoProfile = viewerData.profiles.find(
    (profile: { __typename: string }) => profile.__typename === "SSOProfile"
  );

  return (
    <Profile
      viewer={viewerData}
      story={storyData}
      settings={settingsData}
      isSSO={!isUndefined(ssoProfile)}
      ssoURL={viewerData.ssoURL}
    />
  );
};

export default ProfileContainer;
