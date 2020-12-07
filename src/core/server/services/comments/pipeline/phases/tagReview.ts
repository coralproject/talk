import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

import {
  GQLSTORY_MODE,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

export const tagReview: IntermediateModerationPhase = ({
  storyMode,
  comment,
  bodyText,
  media,
}): IntermediatePhaseResult | void => {
  // If we aren't in a ratings and review story mode, then don't do anything.
  if (storyMode !== GQLSTORY_MODE.RATINGS_AND_REVIEWS) {
    return;
  }

  // If we don't have a rating, then we can't be a review!
  if (!comment.rating) {
    return;
  }

  // If a comment has no body text it can't be a review!
  if (!bodyText && !media) {
    return;
  }

  return { tags: [GQLTAG.REVIEW] };
};
