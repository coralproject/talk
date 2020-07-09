import getHTMLPlainText from "coral-common/helpers/getHTMLPlainText";
import { RepeatPostCommentError } from "coral-server/errors";
import { ACTION_TYPE } from "coral-server/models/action/comment";
import { getLatestRevision } from "coral-server/models/comment/helpers";
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
  action,
  comment,
  embeds,
}): Promise<IntermediatePhaseResult | void> => {
  if (!bodyText && (!embeds || embeds.length === 0)) {
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

    if (!lastComment || action === "EDIT") {
      // The last comment can't been found or none was written within the
      // time frame.
      return;
    }

    const revision = getLatestRevision(lastComment);

    const revisionText = getHTMLPlainText(revision.body).trim();
    const compareTo = bodyText.trim();

    let similarity = null;

    if (bodyText && compareTo.length > 0) {
      // Calculate the comment similarity. At the moment, we only do a string
      // comparison, so it's either completely equal (they match) or the
      // similarity can't be determined (null). This gives us room in the future
      // to include a percentage matching.
      similarity = revisionText === compareTo ? 1 : null;
    } else if (embeds && embeds.length > 0 && revision.embeds.length > 0) {
      const [newEmbed] = embeds;
      const [compareEmbed] = revision.embeds;
      similarity =
        newEmbed.source === "GIPHY" &&
        compareEmbed.source === "GIPHY" &&
        newEmbed.url === compareEmbed.url
          ? 1
          : null;
    }

    if (similarity) {
      log.trace({ similarity }, "comment contains repeat content");

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

    log.trace({ similarity }, "comment is not repeated");
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
