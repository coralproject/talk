import { CommentTag } from "coral-server/models/comment/tag";
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
  comment,
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
    const tags: CommentTag[] = [
      {
        type: GQLTAG.EXPERT,
        createdAt: now,
      },
    ];

    // If this comment is the first reply in a thread (depth of 1)...
    if (comment.ancestorIDs.length === 1) {
      // Add the featured tag!
      tags.push({
        type: GQLTAG.FEATURED,
        createdAt: now,
      });
    }

    return { tags };
  }
};
