import { isUserStoryExpert } from "coral-server/models/story";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

import {
  GQLSTORY_MODE,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

export const tagUnansweredQuestions: IntermediateModerationPhase = ({
  author,
  comment,
  story,
  storyMode,
}): IntermediatePhaseResult | void => {
  // We only show unanswered tags in Q&A.
  if (storyMode !== GQLSTORY_MODE.QA) {
    return;
  }

  // Only top level comments are questions,
  // everything else is replies for Q&A.
  if (comment.parentID) {
    return;
  }

  // If the author is a story expert, then it's not an unanswered comment!
  if (isUserStoryExpert(story.settings, author.id)) {
    return;
  }

  return { tags: [GQLTAG.UNANSWERED] };
};
