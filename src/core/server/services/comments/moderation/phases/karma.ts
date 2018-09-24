import {
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_STATUS,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { ACTION_TYPE } from "talk-server/models/action";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "talk-server/services/comments/moderation";
import {
  getCommentTrustScore,
  isReliableCommenter,
} from "talk-server/services/users/karma";

// This phase checks to see if the user making the comment is allowed to do so
// considering their reliability (Trust) status.
export const karma: IntermediateModerationPhase = ({
  tenant,
  author,
}): IntermediatePhaseResult | void => {
  // If the user is not a reliable commenter (passed the unreliability
  // threshold by having too many rejected comments) then we can change the
  // status of the comment to `SYSTEM_WITHHELD`, therefore pushing the user's
  // comments away from the public eye until a moderator can manage them. This
  // of course can only be applied if the comment's current status is `NONE`,
  // we don't want to interfere if the comment was rejected.
  if (
    tenant.karma.enabled &&
    isReliableCommenter(tenant.karma.thresholds, author) === false
  ) {
    // Add the flag related to Trust to the comment.
    return {
      status: GQLCOMMENT_STATUS.SYSTEM_WITHHELD,
      actions: [
        {
          action_type: ACTION_TYPE.FLAG,
          reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_TOXIC,
          metadata: {
            trust: getCommentTrustScore(author),
          },
        },
      ],
    };
  }
};
