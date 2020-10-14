import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

import {
  GQLTAG,
  GQLUSER_ROLE,
} from "coral-server/graph/schema/__generated__/types";

function roleAsTag(role: GQLUSER_ROLE) {
  switch (role) {
    case GQLUSER_ROLE.ADMIN:
      return GQLTAG.ADMIN;
    case GQLUSER_ROLE.MODERATOR:
      return GQLTAG.MODERATOR;
    case GQLUSER_ROLE.STAFF:
      return GQLTAG.STAFF;
    default:
      return null;
  }
}

// If a given user is a staff member, always approve their comment.
export const staff: IntermediateModerationPhase = ({
  author,
}): IntermediatePhaseResult | void => {
  const staffTag = roleAsTag(author.role);
  if (staffTag) {
    return {
      tags: [staffTag],
    };
  }
};
