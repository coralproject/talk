import { getDepth } from "coral-server/models/comment";
import { resolveStoryMode } from "coral-server/models/story";
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
  story,
  tenant,
  comment,
}): IntermediatePhaseResult | void => {
  if (
    // If we're in Q&A mode...
    resolveStoryMode(story.settings, tenant) === GQLSTORY_MODE.QA &&
    // And we have experts for this story...
    story.settings.expertIDs &&
    // And the author is in expert list...
    story.settings.expertIDs.some((id) => id === author.id)
  ) {
    // Assign this comment an expert tag!
    const tags: GQLTAG[] = [GQLTAG.EXPERT];

    // If this comment is the first reply in a thread (depth of 1)...
    if (getDepth(comment) === 1) {
      // Add the featured tag!
      tags.push(GQLTAG.FEATURED);
    }

    return { tags };
  }
};
