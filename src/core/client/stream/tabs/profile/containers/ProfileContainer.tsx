import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "talk-framework/lib/relay";
import { ProfileContainer_settings as SettingsData } from "talk-stream/__generated__/ProfileContainer_settings.graphql";
import { ProfileContainer_story as StoryData } from "talk-stream/__generated__/ProfileContainer_story.graphql";
import { ProfileContainer_viewer as ViewerData } from "talk-stream/__generated__/ProfileContainer_viewer.graphql";

import Profile from "../components/Profile";

interface ProfileContainerProps {
  viewer: ViewerData;
  settings: SettingsData;
  story: StoryData;
}

export class ProfileContainer extends React.Component<ProfileContainerProps> {
  public render() {
    return (
      <Profile
        viewer={this.props.viewer}
        story={this.props.story}
        settings={this.props.settings}
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
    }
  `,
  settings: graphql`
    fragment ProfileContainer_settings on Settings {
      ...UserBoxContainer_settings
    }
  `,
})(ProfileContainer);

export default enhanced;
