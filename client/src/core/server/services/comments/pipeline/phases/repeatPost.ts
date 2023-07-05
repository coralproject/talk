import getHTMLPlainText from "coral-common/helpers/getHTMLPlainText";
import { RepeatPostCommentError } from "coral-server/errors";
import { ACTION_TYPE } from "coral-server/models/action/comment";
import { getLatestRevision } from "coral-server/models/comment/helpers";
import { supportsMediaType } from "coral-server/models/tenant";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";
import { retrieveUserLastCommentNotArchived } from "coral-server/services/users";

import {
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_STATUS,
} from "coral-server/graph/schema/__generated__/types";

export const repeatPost: IntermediateModerationPhase = async ({
  mongo,
  comment,
  action,
  bodyText,
  tenant,
  author,
  nudge,
  redis,
  log,
  media,
}): Promise<IntermediatePhaseResult | void> => {
  // We don't have to screen a comment for a repeat post if the comment has no
  // body text and it has no media.
  if (!bodyText && !media) {
    return;
  }

  try {
    log.trace("checking comment for repeat content");

    // Get the last comment (if it exists).
    const lastComment = await retrieveUserLastCommentNotArchived(
      mongo,
      redis,
      tenant,
      author
    );
    if (!lastComment) {
      // The last comment can't been found or none was written within the
      // time frame.
      return;
    }

    if (action === "EDIT" && comment.id && comment.id === lastComment.id) {
      // The last comment written is this comment because we're editing, so no
      // need to compare against.
      return;
    }

    const lastCommentRevision = getLatestRevision(lastComment);
    const lastCommentBodyText = getHTMLPlainText(lastCommentRevision.body);

    let similarity: null | boolean = null;

    // Check to see if the comment text is the same on both comments.
    if (lastCommentBodyText !== bodyText) {
      // Body text is not the same, can't be a repeat post!
      similarity = false;
    } else if (supportsMediaType(tenant, "giphy")) {
      // Giphy is enabled. If the medias are the same, then this is a repeat
      // comment otherwise they are not.
      if (
        (!lastCommentRevision.media && !media) ||
        (lastCommentRevision.media && !media)
      ) {
        // comment body was the same and neither comment has media OR the previous
        // comment had media but the current one does not
        similarity = true;
      } else if (
        // Check to see if the last comment revision has a Giphy Media
        // object.
        lastCommentRevision.media &&
        lastCommentRevision.media.type === "giphy" &&
        // Check to see if the current comment revision has a Giphy Media
        // object.
        media &&
        media.type === "giphy" &&
        // Check to see if the media id's are the same.
        lastCommentRevision.media.id === media.id
      ) {
        // Comment body text was the same and the media was the same.
        similarity = true;
      } else {
        // Comment body text was the same but the media was different.
        similarity = false;
      }
    } else {
      // Body text was the same and Giphy support was not enabled.
      similarity = true;
    }

    if (similarity) {
      log.trace({ similarity }, "comment content is repeated");

      // Throw an error if we're nudging instead of recording.
      if (nudge) {
        throw new RepeatPostCommentError();
      }

      return {
        status: GQLCOMMENT_STATUS.SYSTEM_WITHHELD,
        actions: [
          {
            actionType: ACTION_TYPE.FLAG,
            reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_REPEAT_POST,
          },
        ],
        metadata: {},
      };
    }

    log.trace({ similarity }, "comment content is not repeated");
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
