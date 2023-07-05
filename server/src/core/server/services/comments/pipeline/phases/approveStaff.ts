import { intersection } from "lodash";

import { STAFF_TAGS } from "coral-server/models/comment/tag";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

import { GQLCOMMENT_STATUS } from "coral-server/graph/schema/__generated__/types";

export const approveStaff: IntermediateModerationPhase = ({
  tags,
}): IntermediatePhaseResult | void => {
  // Find how many tags on the comment intersect with the list of staff tags. If
  // we find one matching tag, then we should approve it!
  const intersecting = intersection(STAFF_TAGS, tags);
  if (intersecting.length === 0) {
    return;
  }

  return { status: GQLCOMMENT_STATUS.APPROVED };
};
