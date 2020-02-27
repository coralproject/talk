import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

import {
  GQLSTORY_MODE,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

export const tagExpertAnswers: IntermediateModerationPhase = ({
  author,
  now,
  story,
}): IntermediatePhaseResult | void => {
  if (
    // If we're in Q&A mode...
    story.settings.mode === GQLSTORY_MODE.QA &&
    // And we have experts for this story...
    story.settings.expertIDs &&
    // And the author is in expert list...
    story.settings.expertIDs.some(id => id === author.id)
  ) {
    // Assign this comment an expert tag!
    return {
      tags: [
        {
          type: GQLTAG.EXPERT,
          createdAt: now,
        },
      ],
    };
  }
};
