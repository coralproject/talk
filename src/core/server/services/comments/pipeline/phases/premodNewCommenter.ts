import {
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_STATUS,
} from "coral-server/graph/tenant/schema/__generated__/types";
import { ACTION_TYPE } from "coral-server/models/action/comment";
import { countApprovedComments } from "coral-server/models/comment";
import {
  IntermediatePhaseResult,
  ModerationPhaseContext,
} from "coral-server/services/comments/pipeline";

export const premodNewCommenter = async ({
  tenant,
  author,
  mongo,
  now,
}: Pick<
  ModerationPhaseContext,
  "author" | "tenant" | "now" | "mongo"
>): Promise<IntermediatePhaseResult | void> => {
  // Ensure this mode is enabled.
  if (!tenant.newCommenters.premodEnabled) {
    return;
  }

  // Get the comment rates for this User.
  const count = await countApprovedComments(
    mongo,
    tenant.id,
    tenant.newCommenters.approvedCommentsThreshold,
    author.id
  );

  if (count < tenant.newCommenters.approvedCommentsThreshold) {
    return {
      status: GQLCOMMENT_STATUS.SYSTEM_WITHHELD,
      actions: [
        {
          userID: null,
          actionType: ACTION_TYPE.FLAG,
          reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_NEW_COMMENTER,
          metadata: {
            count,
          },
        },
      ],
    };
  }
};
