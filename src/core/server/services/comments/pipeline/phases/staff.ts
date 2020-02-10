import {
  GQLTAG,
  GQLUSER_ROLE,
} from "coral-server/graph/schema/__generated__/types";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

// If a given user is a staff member, always approve their comment.
export const staff: IntermediateModerationPhase = ({
  author,
  now,
}): IntermediatePhaseResult | void => {
  if (author.role !== GQLUSER_ROLE.COMMENTER) {
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
