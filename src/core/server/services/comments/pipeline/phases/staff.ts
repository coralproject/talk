import { hasStaffRole } from "coral-server/models/user/helpers";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

import { GQLTAG } from "coral-server/graph/schema/__generated__/types";

// If a given user is a staff member, always approve their comment.
export const staff: IntermediateModerationPhase = ({
  author,
  now,
}): IntermediatePhaseResult | void => {
  if (hasStaffRole(author)) {
    return {
      tags: [
        {
          type: GQLTAG.STAFF,
          createdAt: now,
        },
      ],
    };
  }
};
