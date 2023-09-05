import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

import {
  GQLCOMMENT_STATUS,
  GQLSTORY_MODE,
} from "coral-server/graph/schema/__generated__/types";

export const approveRatings: IntermediateModerationPhase = ({
  storyMode,
  comment,
  bodyText,
}): IntermediatePhaseResult | void => {
  // If we aren't in a ratings and review story mode, then we can't be a rating!
  if (storyMode !== GQLSTORY_MODE.RATINGS_AND_REVIEWS) {
    return;
  }

  // If we doesn't have a rating, then do nothing!
  if (!comment.rating) {
    return;
  }

  // If the comment has bodyText, then it's a review, so do nothing!
  if (bodyText) {
    return;
  }

  // Otherwise it's just a rating only comment, so approve it!
  return { status: GQLCOMMENT_STATUS.APPROVED };
};
