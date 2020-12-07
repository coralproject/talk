import { getDepth } from "coral-server/models/comment";
import { isUserStoryExpert } from "coral-server/models/story";
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
  storyMode,
  story,
  comment,
}): IntermediatePhaseResult | void => {
  // If we're not in Q&A mode, then do nothing!
  if (storyMode !== GQLSTORY_MODE.QA) {
    return;
  }

  // If the author is not an expert on the story (or the story has no experts)
  // then do nothing!
  if (!isUserStoryExpert(story.settings, author.id)) {
    return;
  }

  // If this comment is the first reply in a thread (depth of 1)...
  if (getDepth(comment) === 1) {
    // Add the featured tag!
    return { tags: [GQLTAG.FEATURED, GQLTAG.EXPERT] };
  }

  return { tags: [GQLTAG.EXPERT] };
};
