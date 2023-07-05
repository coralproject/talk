import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { StoryRatingContainer_story } from "coral-stream/__generated__/StoryRatingContainer_story.graphql";

import StoryRating from "./StoryRating";

interface Props {
  story: StoryRatingContainer_story;
}

const StoryRatingContainer: FunctionComponent<Props> = ({ story }) => {
  if (!story.ratings) {
    return null;
  }

  return (
    <StoryRating
      title={story.metadata?.title}
      average={story.ratings.average}
      count={story.ratings.count}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
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
})(StoryRatingContainer);

export default enhanced;
