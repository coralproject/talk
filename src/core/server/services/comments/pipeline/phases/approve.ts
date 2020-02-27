import { CommentTag } from "coral-server/models/comment/tag";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

import {
  GQLCOMMENT_STATUS,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

interface Result {
  status?: GQLCOMMENT_STATUS;
  tags: CommentTag[];
}

export const approve: IntermediateModerationPhase = ({
  tags,
  now,
}): IntermediatePhaseResult | void => {
  const result: Result = {
    tags: [],
  };

  // If the user is tagged STAFF or EXPERT then we approve
  // their comment.
  //
  // STAFF: all staff comments are automatically approved.
  //
  // EXPERT: when in Q&A mode, all expert comments are
  //   automatically approved. We will only see EXPERT
  //   tags assigned when we are in Q&A mode, so we can
  //   trust this simple tag type check.
  if (
    tags.some(tag => tag.type === GQLTAG.STAFF || tag.type === GQLTAG.EXPERT)
  ) {
    result.status = GQLCOMMENT_STATUS.APPROVED;
  }

  return result;
};
