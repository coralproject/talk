import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { StoryStatusContainer_story$key as StoryStatusContainer_story } from "coral-admin/__generated__/StoryStatusContainer_story.graphql";

import StoryStatusText from "./StoryStatusText";

interface Props {
  story: StoryStatusContainer_story;
}

const StoryStatusContainer: FunctionComponent<Props> = ({ story }) => {
  const storyData = useFragment(
    graphql`
      fragment StoryStatusContainer_story on Story {
        id
        status
        isArchiving
        isArchived
      }
    `,
    story
  );

  return (
    <StoryStatusText
      isArchived={storyData.isArchived}
      isArchiving={storyData.isArchiving}
    >
      {storyData.status}
    </StoryStatusText>
  );
};

export default StoryStatusContainer;
