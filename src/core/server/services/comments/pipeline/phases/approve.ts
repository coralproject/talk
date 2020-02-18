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

  // If user is an expert and we are in Q&A mode
  // approve and feature the comment
  if (tags.some(tag => tag.type === GQLTAG.EXPERT)) {
    result.status = GQLCOMMENT_STATUS.APPROVED;
    result.tags.push({
      type: GQLTAG.FEATURED,
      createdAt: now,
    });
  }

  // If user is tagged staff, approve their comment
  if (tags.some(tag => tag.type === GQLTAG.STAFF)) {
    result.status = GQLCOMMENT_STATUS.APPROVED;
  }

  return result;
};
