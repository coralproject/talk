import { RepeatPostCommentError } from "coral-server/errors";
import {
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_STATUS,
} from "coral-server/graph/tenant/schema/__generated__/types";
import logger from "coral-server/logger";
import { ACTION_TYPE } from "coral-server/models/action/comment";
import { getLatestRevision } from "coral-server/models/comment/helpers";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";
import { retrieveUserLastComment } from "coral-server/services/users";

export const repeatPost: IntermediateModerationPhase = async ({
  story,
  mongo,
  tenant,
  comment,
  author,
  req,
  nudge,
  redis,
}): Promise<IntermediatePhaseResult | void> => {
  const log = logger.child(
    {
      tenantID: tenant.id,
    },
    true
  );

  if (!comment.body) {
    return;
  }

  try {
    log.trace("checking comment for repeat content");

    const lastComment = await retrieveUserLastComment(
      mongo,
      redis,
      tenant,
      author
    );

    if (!lastComment) {
      return;
    }

    const revision = getLatestRevision(lastComment);
    const isRepeatComment = revision.body === comment.body;

    if (isRepeatComment) {
      log.trace({ isRepeatComment }, "comment contains repeat content");

      // Throw an error if we're nudging instead of recording.
      if (nudge) {
        throw new RepeatPostCommentError();
      }

      return {
        status: GQLCOMMENT_STATUS.SYSTEM_WITHHELD,
        actions: [
          {
            userID: null,
            actionType: ACTION_TYPE.FLAG,
            reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_REPEAT_POST,
          },
        ],
        metadata: {},
      };
    }

    log.trace({ isRepeatComment }, "comment is not repeated");
  } catch (err) {
    // Rethrow any RepeatPostError.
    if (err instanceof RepeatPostCommentError) {
      throw err;
    }

    log.error(
      { err },
      "could not determine if comment contained duplicate content"
    );
  }
};
