import getHTMLPlainText from "coral-common/helpers/getHTMLPlainText";
import { RepeatPostCommentError } from "coral-server/errors";
import { ACTION_TYPE } from "coral-server/models/action/comment";
import { getLatestRevision } from "coral-server/models/comment/helpers";
import { supportsEmbedType } from "coral-server/models/tenant";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";
import { retrieveUserLastComment } from "coral-server/services/users";

import {
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_STATUS,
} from "coral-server/graph/schema/__generated__/types";

export const repeatPost: IntermediateModerationPhase = async ({
  mongo,
  bodyText,
  tenant,
  author,
  nudge,
  redis,
  log,
  embed,
}): Promise<IntermediatePhaseResult | void> => {
  if (!bodyText && !embed) {
    return;
  }

  try {
    log.trace("checking comment for repeat content");

    // Get the last comment (if it exists).
    const lastComment = await retrieveUserLastComment(
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

    const lastCommentRevision = getLatestRevision(lastComment);
    const lastCommentBodyText = getHTMLPlainText(lastCommentRevision.body);

    let similarity: null | boolean = null;

    // Check to see if the comment text is the same on both comments.
    if (lastCommentBodyText !== bodyText) {
      // Body text is not the same, can't be a repeat post!
      similarity = false;
    } else if (supportsEmbedType(tenant, "giphy")) {
      // Giphy is enabled. If the embeds are the same, then this is a repeat
      // comment otherwise they are not.
      if (
        // Check to see if the last comment revision has a Giphy Media
        // object.
        lastCommentRevision.embed &&
        lastCommentRevision.embed.type === "giphy" &&
        // Check to see if the current comment revision has a Giphy Media
        // object.
        embed &&
        embed.type === "giphy" &&
        // Check to see if the embed id's are the same.
        lastCommentRevision.embed.id === embed.id
      ) {
        // Comment body text was the same and the embed was the same.
        similarity = true;
      } else {
        // Comment body text was the same but the embed was different.
        similarity = false;
      }
    } else {
      // Body text was the same and Giphy support was not enabled.
      similarity = false;
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
