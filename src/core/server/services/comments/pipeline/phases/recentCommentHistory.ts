import { DateTime } from "luxon";

import { ACTION_TYPE } from "coral-server/models/action/comment";
import {
  calculateRejectionRate,
  retrieveRecentStatusCounts,
} from "coral-server/models/comment";
import {
  IntermediatePhaseResult,
  ModerationPhaseContext,
} from "coral-server/services/comments/pipeline";

import {
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_STATUS,
} from "coral-server/graph/schema/__generated__/types";

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
  const counts = await retrieveRecentStatusCounts(
    mongo,
    tenant.id,
    since,
    author.id
  );

  // Get the rejection rate.
  const rate = calculateRejectionRate(counts);
  if (rate >= tenant.recentCommentHistory.triggerRejectionRate) {
    return {
      status: GQLCOMMENT_STATUS.SYSTEM_WITHHELD,
      actions: [
        {
          actionType: ACTION_TYPE.FLAG,
          reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_RECENT_HISTORY,
          metadata: {
            rate,
          },
        },
      ],
    };
  }
};
