import { isUndefined } from "lodash";
import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { ProfileContainer_settings as SettingsData } from "coral-stream/__generated__/ProfileContainer_settings.graphql";
import { ProfileContainer_story as StoryData } from "coral-stream/__generated__/ProfileContainer_story.graphql";
import { ProfileContainer_viewer as ViewerData } from "coral-stream/__generated__/ProfileContainer_viewer.graphql";

import Profile from "./Profile";

interface ProfileContainerProps {
  viewer: ViewerData;
  settings: SettingsData;
  story: StoryData;
}

export class ProfileContainer extends React.Component<ProfileContainerProps> {
  public render() {
    const ssoProfile = this.props.viewer.profiles.find(
      (profile) => profile.__typename === "SSOProfile"
    );
    return (
      <Profile
        viewer={this.props.viewer}
        story={this.props.story}
        settings={this.props.settings}
        isSSO={!isUndefined(ssoProfile)}
        ssoURL={this.props.viewer.ssoURL}
      />
    );
  }
}
const enhanced = withFragmentContainer<ProfileContainerProps>({
  story: graphql`
    fragment ProfileContainer_story on Story {
      ...MyCommentsContainer_story
    }
  `,
  viewer: graphql`
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
  settings: graphql`
    fragment ProfileContainer_settings on Settings {
      ...UserBoxContainer_settings
      ...AccountSettingsContainer_settings
      ...MyCommentsContainer_settings
      ...PreferencesContainer_settings
    }
  `,
})(ProfileContainer);

export default enhanced;
