import {
  GQLCOMMENT_STATUS,
  GQLUSER_ROLE,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { IntermediateModerationPhase } from "talk-server/services/comments/moderation";

// If a given user is a staff member, always approve their comment.
export const staff: IntermediateModerationPhase = ({
  asset,
  tenant,
  comment,
  author,
}) => {
  if (author.role !== GQLUSER_ROLE.COMMENTER) {
    return {
      status: GQLCOMMENT_STATUS.ACCEPTED,
    };
  }

  return;
};
