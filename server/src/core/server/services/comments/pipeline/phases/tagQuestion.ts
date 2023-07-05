import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

import {
  GQLSTORY_MODE,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

export const tagQuestion: IntermediateModerationPhase = ({
  storyMode,
  parent,
  comment,
}): IntermediatePhaseResult | void => {
  // If we aren't in a ratings and review story mode, then don't do anything.
  if (storyMode !== GQLSTORY_MODE.RATINGS_AND_REVIEWS) {
    return;
  }

  // If this comment has a rating, it can't be a question!
  if (comment.rating) {
    return;
  }

  // If this comment has a parent (is a reply) then it can't be a question!
  if (parent) {
    return;
  }

  // Add the question tag!
  return { tags: [GQLTAG.QUESTION] };
};
