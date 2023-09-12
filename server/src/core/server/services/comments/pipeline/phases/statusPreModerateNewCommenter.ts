import { ACTION_TYPE } from "coral-server/models/action/comment";
import {
  IntermediatePhaseResult,
  ModerationPhaseContext,
} from "coral-server/services/comments/pipeline";

import {
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_STATUS,
  GQLMODERATION_MODE,
} from "coral-server/graph/schema/__generated__/types";

export const statusPreModerateNewCommenter = async ({
  tenant,
  story,
  author,
}: Pick<
  ModerationPhaseContext,
  "author" | "tenant" | "now" | "mongo" | "story"
>): Promise<IntermediatePhaseResult | void> => {
  if (tenant.newCommenters.moderation && tenant.newCommenters.moderation.mode) {
    // If specific sites pre-moderation mode is enabled, check if this is a
    // site set to pre-moderate all new users
    if (
      tenant.newCommenters.moderation.mode ===
      GQLMODERATION_MODE.SPECIFIC_SITES_PRE
    ) {
      // If premodSites doesn't include this site id, then do nothing!
      if (
        tenant.newCommenters.moderation.premodSites &&
        !tenant.newCommenters.moderation.premodSites.includes(story.siteID)
      ) {
        return;
      }
    } else {
      // If pre-moderation mode is set to POST for new commenters, then do nothing!
      if (tenant.newCommenters.moderation.mode === GQLMODERATION_MODE.POST) {
        return;
      }
    }
    // If newCommenters.moderation doesn't exist, check the deprecated premodEnabled
    // If pre-moderation is disabled for new commenters here, then do nothing!
  } else {
    if (!tenant.newCommenters.premodEnabled) {
      return;
    }
  }

  // If the threshold is equal to or less than zero, then there's nothing to do!
  if (tenant.newCommenters.approvedCommentsThreshold <= 0) {
    return;
  }

  // If the user is imported and if the number of published comments on the user
  // is greater than or equal to the threshold, then there's nothing to do!
  if (
    author.importedAt &&
    author.commentCounts.status.NONE + author.commentCounts.status.APPROVED >=
      tenant.newCommenters.approvedCommentsThreshold
  ) {
    return;
  }

  // If the number of approved comments on the user is greater than or equal to
  // the threshold, then there's nothing to do!
  if (
    author.commentCounts.status.APPROVED >=
    tenant.newCommenters.approvedCommentsThreshold
  ) {
    return;
  }

  return {
    status: GQLCOMMENT_STATUS.SYSTEM_WITHHELD,
    actions: [
      {
        actionType: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_NEW_COMMENTER,
        metadata: {
          count: author.commentCounts.status.APPROVED,
        },
      },
    ],
  };
};
