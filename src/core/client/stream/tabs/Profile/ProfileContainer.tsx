import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { ProfileContainer_organization as OrgData } from "coral-stream/__generated__/ProfileContainer_organization.graphql";
import { ProfileContainer_settings as SettingsData } from "coral-stream/__generated__/ProfileContainer_settings.graphql";
import { ProfileContainer_story as StoryData } from "coral-stream/__generated__/ProfileContainer_story.graphql";
import { ProfileContainer_viewer as ViewerData } from "coral-stream/__generated__/ProfileContainer_viewer.graphql";

import Profile from "./Profile";

interface ProfileContainerProps {
  viewer: ViewerData;
  settings: SettingsData;
  organization: OrgData;
  story: StoryData;
}

export class ProfileContainer extends React.Component<ProfileContainerProps> {
  public render() {
    return (
      <Profile
        viewer={this.props.viewer}
        story={this.props.story}
        settings={this.props.settings}
        organization={this.props.organization}
      />
    );
  }
}
const enhanced = withFragmentContainer<ProfileContainerProps>({
  story: graphql`
    fragment ProfileContainer_story on Story {
      ...CommentHistoryContainer_story
    }
  `,
  viewer: graphql`
    fragment ProfileContainer_viewer on User {
      ...UserBoxContainer_viewer
      ...CommentHistoryContainer_viewer
      ...AccountSettingsContainer_viewer
      ...ChangeUsernameContainer_viewer
      ...ChangeEmailContainer_viewer
      ...DeletionRequestCalloutContainer_viewer
      ...NotificationSettingsContainer_viewer
    }
  `,
  organization: graphql`
    fragment ProfileContainer_organization on Organization {
      ...UserBoxContainer_organization
      ...AccountSettingsContainer_organization
    }
  `,
  settings: graphql`
    fragment ProfileContainer_settings on Settings {
      ...CommentHistoryContainer_settings
    }
  `,
})(ProfileContainer);

export default enhanced;
