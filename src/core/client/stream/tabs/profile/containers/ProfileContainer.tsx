import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "talk-framework/lib/relay";
import { ProfileContainer_me as MeData } from "talk-stream/__generated__/ProfileContainer_me.graphql";
import { ProfileContainer_settings as SettingsData } from "talk-stream/__generated__/ProfileContainer_settings.graphql";
import { ProfileContainer_story as StoryData } from "talk-stream/__generated__/ProfileContainer_story.graphql";

import Profile from "../components/Profile";

interface ProfileContainerProps {
  me: MeData;
  settings: SettingsData;
  story: StoryData;
}

export class ProfileContainer extends React.Component<ProfileContainerProps> {
  public render() {
    return (
      <Profile
        me={this.props.me}
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
  me: graphql`
    fragment ProfileContainer_me on User {
      ...UserBoxContainer_me
      ...CommentHistoryContainer_me
    }
  `,
  settings: graphql`
    fragment ProfileContainer_settings on Settings {
      ...UserBoxContainer_settings
    }
  `,
})(ProfileContainer);

export default enhanced;
