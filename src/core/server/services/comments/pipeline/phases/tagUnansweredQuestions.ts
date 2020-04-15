import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

import {
  GQLSTORY_MODE,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

export const tagUnansweredQuestions: IntermediateModerationPhase = ({
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

  // If we have no experts, or the current author is
  // not an expert, then this is an UNANSWERED comment.
  if (
    !story.settings.expertIDs ||
    story.settings.expertIDs.every((id) => id !== comment.authorID)
  ) {
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
