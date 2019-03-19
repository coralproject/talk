import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "talk-framework/lib/relay";
import { ConfigureContainer_me as MeData } from "talk-stream/__generated__/ConfigureContainer_me.graphql";
import { ConfigureContainer_settings as SettingsData } from "talk-stream/__generated__/ConfigureContainer_settings.graphql";
import { ConfigureContainer_story as StoryData } from "talk-stream/__generated__/ConfigureContainer_story.graphql";

import Configure from "../components/Configure";

interface ConfigureContainerProps {
  me: MeData;
  settings: SettingsData;
  story: StoryData;
}

export class StreamContainer extends React.Component<ConfigureContainerProps> {
  public render() {
    return (
      <Configure
        story={this.props.story}
        settings={this.props.settings}
        me={this.props.me}
      />
    );
  }
}
const enhanced = withFragmentContainer<ConfigureContainerProps>({
  story: graphql`
    fragment ConfigureContainer_story on Story {
      ...ConfigureStreamContainer_story
      ...OpenOrCloseStreamContainer_story
    }
  `,
  me: graphql`
    fragment ConfigureContainer_me on User {
      ...UserBoxContainer_me
    }
  `,
  settings: graphql`
    fragment ConfigureContainer_settings on Settings {
      ...UserBoxContainer_settings
    }
  `,
})(StreamContainer);

export default enhanced;
