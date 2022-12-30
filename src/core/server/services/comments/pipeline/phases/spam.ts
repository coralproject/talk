import { SpamCommentError } from "coral-server/errors";
import { ACTION_TYPE } from "coral-server/models/action/comment";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";
import { checkCommentIsSpam } from "coral-server/services/spam";

import {
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_STATUS,
} from "coral-server/graph/schema/__generated__/types";

export const spam: IntermediateModerationPhase = async ({
  story,
  tenant,
  comment,
  author,
  req,
  nudge,
  log,
}): Promise<IntermediatePhaseResult | void> => {
  let recheck;
  if (comment.id) {
    // We only have a comment ID already at this point if this comment is being
    // edited.
    recheck = "edit";
  }
  const isSpam = await checkCommentIsSpam(
    tenant,
    comment,
    req,
    story,
    author,
    recheck
  );
  log.trace("checking comment for spam");
  if (isSpam) {
    log.trace({ isSpam }, "comment contained spam");

    // Throw an error if we're nudging instead of recording.
    if (nudge) {
      throw new SpamCommentError();
    }

    return {
      status: GQLCOMMENT_STATUS.SYSTEM_WITHHELD,
      actions: [
        {
          actionType: ACTION_TYPE.FLAG,
          reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_SPAM,
        },
      ],
      metadata: {
        // Store the spam result from Akismet in the Comment metadata.
        akismet: isSpam,
      },
    };
  }

  log.trace({ isSpam }, "comment did not contain spam");
};
