import { GQLCOMMENT_STATUS } from "talk-server/graph/tenant/schema/__generated__/types";
import { IntermediateModerationPhase } from "talk-server/services/comments/moderation";

export const commentLength: IntermediateModerationPhase = async (
  asset,
  tenant,
  comment
) => {
  // Check to see if the body is too short, if it is, then complain about it!
  if (comment.body.length < 2) {
    // TODO: (wyattjoh) return better error.
    throw new Error("comment body too short");
  }

  // Reject if the comment is too long
  if (
    tenant.charCountEnable &&
    tenant.charCount &&
    comment.body.length > tenant.charCount
  ) {
    // Add the flag related to Trust to the comment.
    return {
      status: GQLCOMMENT_STATUS.REJECTED,
      actions: [
        // TODO: (wyattjoh) return the right flag/action.
        // {
        //   action_type: "FLAG",
        //   user_id: null,
        //   group_id: "BODY_COUNT",
        //   metadata: {
        //     count: comment.body.length,
        //   },
        // },
      ],
    };
  }

  return;
};
