import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { StoryRatingContainer_story$key as StoryRatingContainer_story } from "coral-stream/__generated__/StoryRatingContainer_story.graphql";

import StoryRating from "./StoryRating";

interface Props {
  story: StoryRatingContainer_story;
}

const StoryRatingContainer: FunctionComponent<Props> = ({ story }) => {
  const storyData = useFragment(
    graphql`
      fragment StoryRatingContainer_story on Story {
        id
        metadata {
          title
        }
        ratings {
          average
          count
        }
      }
    `,
    story
  );

  if (!storyData.ratings) {
    return null;
  }

  return (
    <StoryRating
      title={storyData.metadata?.title}
      average={storyData.ratings.average}
      count={storyData.ratings.count}
    />
  );
};

export default StoryRatingContainer;
