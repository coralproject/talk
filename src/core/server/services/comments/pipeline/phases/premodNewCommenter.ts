import {
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_STATUS,
} from "coral-server/graph/schema/__generated__/types";
import { ACTION_TYPE } from "coral-server/models/action/comment";
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

  if (
    author.commentCounts.status.APPROVED <
    tenant.newCommenters.approvedCommentsThreshold
  ) {
    return {
      status: GQLCOMMENT_STATUS.SYSTEM_WITHHELD,
      actions: [
        {
          userID: null,
          actionType: ACTION_TYPE.FLAG,
          reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_NEW_COMMENTER,
          metadata: {
            count: author.commentCounts.status.APPROVED,
          },
        },
      ],
    };
  }
};
