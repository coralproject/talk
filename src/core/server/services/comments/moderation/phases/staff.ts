import { GQLCOMMENT_STATUS } from "talk-server/graph/tenant/schema/__generated__/types";
import { IntermediateModerationPhase } from "talk-server/services/comments/moderation";

// If a given user is a staff member, always approve their comment.
export const staff: IntermediateModerationPhase = (
  asset,
  tenant,
  comment,
  author
) => {
  // TODO: (wyattjoh) check to see if the user is staff.
  if (false) {
    return {
      status: GQLCOMMENT_STATUS.ACCEPTED,
    };
  }

  return;
};
