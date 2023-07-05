import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

import {
  GQLCOMMENT_STATUS,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

export const approveExpertAnswers: IntermediateModerationPhase = ({
  tags,
}): IntermediatePhaseResult | void => {
  // If the comment doesn't have the expert tag, then do nothing!
  if (!tags.includes(GQLTAG.EXPERT)) {
    return;
  }

  return { status: GQLCOMMENT_STATUS.APPROVED };
};
