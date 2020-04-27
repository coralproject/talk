import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { ConfigureContainer_settings as SettingsData } from "coral-stream/__generated__/ConfigureContainer_settings.graphql";
import { ConfigureContainer_story as StoryData } from "coral-stream/__generated__/ConfigureContainer_story.graphql";
import { ConfigureContainer_viewer as ViewerData } from "coral-stream/__generated__/ConfigureContainer_viewer.graphql";

import Configure from "./Configure";

interface ConfigureContainerProps {
  viewer: ViewerData;
  settings: SettingsData;
  story: StoryData;
}

export class StreamContainer extends React.Component<ConfigureContainerProps> {
  public render() {
    return (
      <Configure
        story={this.props.story}
        settings={this.props.settings}
        viewer={this.props.viewer}
      />
    );
  }
}
const enhanced = withFragmentContainer<ConfigureContainerProps>({
  story: graphql`
    fragment ConfigureContainer_story on Story {
      ...ConfigureStreamContainer_story
      ...OpenOrCloseStreamContainer_story
      ...ModerateStreamContainer_story
      ...QAConfigContainer_story
      ...LiveUpdatesConfigContainer_story
    }
  `,
  viewer: graphql`
    fragment ConfigureContainer_viewer on User {
      ...UserBoxContainer_viewer
    }
  `,
  settings: graphql`
    fragment ConfigureContainer_settings on Settings {
      ...UserBoxContainer_settings
      ...ModerateStreamContainer_settings
      ...QAConfigContainer_settings
    }
  `,
})(StreamContainer);

export default enhanced;
