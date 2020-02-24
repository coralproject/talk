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
    story.settings.mode === GQLSTORY_MODE.QA &&
    story.settings.expertIDs &&
    story.settings.expertIDs.some(id => id === author.id)
  ) {
    return {
      tags: [
        {
          type: GQLTAG.EXPERT,
          createdAt: now,
        },
        {
          type: GQLTAG.FEATURED,
          createdAt: now,
        },
      ],
    };
  }
};
