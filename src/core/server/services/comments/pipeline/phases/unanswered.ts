import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

import {
  GQLSTORY_MODE,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

export const unanswered: IntermediateModerationPhase = ({
  comment,
  story,
  now,
}): IntermediatePhaseResult | void => {
  // We only show unanswered tags in Q&A.
  if (story.settings.mode !== GQLSTORY_MODE.QA) {
    return;
  }

  // Only top level comments are questions,
  // everything else is replies for Q&A.
  if (comment.parentID) {
    return;
  }

  // If we have no experts, this user cannot
  // be one and this must be a question.
  if (!story.settings.expertIDs) {
    return {
      tags: [
        {
          type: GQLTAG.UNANSWERED,
          createdAt: now,
        },
      ],
    };
  }

  // If we have experts and the user is not one
  // of them, this is an unanswered question.
  if (!story.settings.expertIDs.some(id => id === comment.authorID)) {
    return {
      tags: [
        {
          type: GQLTAG.UNANSWERED,
          createdAt: now,
        },
      ],
    };
  }
};
