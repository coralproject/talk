import { DateTime } from "luxon";

import {
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_STATUS,
} from "coral-server/graph/tenant/schema/__generated__/types";
import { ACTION_TYPE } from "coral-server/models/action/comment";
import { retrieveRecentStatusCounts } from "coral-server/models/comment";
import { VISIBLE_STATUSES } from "coral-server/models/comment/constants";
import { CommentStatusCounts } from "coral-server/models/comment/helpers";
import {
  IntermediatePhaseResult,
  ModerationPhaseContext,
} from "coral-server/services/comments/pipeline";

export function calculateRejectionRate(counts: CommentStatusCounts): number {
  const visible = VISIBLE_STATUSES.reduce(
    (acc, status) => counts[status] + acc,
    0
  );
  const rejected = counts[GQLCOMMENT_STATUS.REJECTED];

  return Math.floor((rejected / (visible + rejected)) * 100);
}

export const recentCommentHistory = async ({
  tenant,
  author,
  mongo,
  now,
}: Pick<
  ModerationPhaseContext,
  "author" | "tenant" | "now" | "mongo"
>): Promise<IntermediatePhaseResult | void> => {
  // Ensure this mode is enabled.
  if (!tenant.recentCommentHistory.enabled) {
    return;
  }

  // Get the time frame.
  const since = DateTime.fromJSDate(now)
    .plus({ seconds: -tenant.recentCommentHistory.timeFrame })
    .toJSDate();

  // Get the comment rates for this User.
  const counts = await retrieveRecentStatusCounts(mongo, tenant.id, since, {
    authorID: author.id,
  });

  // Get the rejection rate.
  const rate = calculateRejectionRate(counts);
  if (rate >= tenant.recentCommentHistory.triggerRejectionRate) {
    // Add the flag related to Trust to the comment.
    return {
      status: GQLCOMMENT_STATUS.PREMOD,
      actions: [
        {
          userID: null,
          actionType: ACTION_TYPE.FLAG,
          reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_TRUST,
          metadata: {
            rate,
          },
        },
      ],
    };
  }
};
