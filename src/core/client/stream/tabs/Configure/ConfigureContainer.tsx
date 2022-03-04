import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { ConfigureContainer_settings$key as SettingsData } from "coral-stream/__generated__/ConfigureContainer_settings.graphql";
import { ConfigureContainer_story$key as StoryData } from "coral-stream/__generated__/ConfigureContainer_story.graphql";
import { ConfigureContainer_viewer$key as ViewerData } from "coral-stream/__generated__/ConfigureContainer_viewer.graphql";

import Configure from "./Configure";

interface ConfigureContainerProps {
  viewer: ViewerData;
  settings: SettingsData;
  story: StoryData;
}

const StreamContainer: FunctionComponent<ConfigureContainerProps> = ({
  viewer,
  settings,
  story,
}) => {
  const storyData = useFragment(
    graphql`
      fragment ConfigureContainer_story on Story {
        isArchived
        isArchiving
        ...ConfigureStreamContainer_story
        ...OpenOrCloseStreamContainer_story
        ...ModerateStreamContainer_story
        ...QAConfigContainer_story
        ...AddMessageContainer_story
        ...ArchivedConfigurationContainer_story
      }
    `,
    story
  );
  const viewerData = useFragment(
    graphql`
      fragment ConfigureContainer_viewer on User {
        ...UserBoxContainer_viewer
      }
    `,
    viewer
  );
  const settingsData = useFragment(
    graphql`
      fragment ConfigureContainer_settings on Settings {
        ...UserBoxContainer_settings
        ...ModerateStreamContainer_settings
        ...QAConfigContainer_settings
      }
    `,
    settings
  );

  return (
    <Configure
      story={storyData}
      settings={settingsData}
      viewer={viewerData}
      isArchived={storyData.isArchived}
      isArchiving={storyData.isArchiving}
    />
  );
};

export default StreamContainer;
