import {
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_STATUS,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { ACTION_TYPE } from "talk-server/models/action/comment";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "talk-server/services/comments/pipeline";
import { containsMatchingPhraseMemoized } from "talk-server/services/comments/pipeline/wordList";

// This phase checks the comment against the wordList.
export const wordList: IntermediateModerationPhase = ({
  tenant,
  comment,
}): IntermediatePhaseResult | void => {
  // If there isn't a body, there can't be a bad word!
  if (!comment.body) {
    return;
  }

  // Decide the status based on whether or not the current story/settings
  // has pre-mod enabled or not. If the comment was rejected based on the
  // wordList, then reject it, otherwise if the moderation setting is
  // premod, set it to `premod`.
  if (containsMatchingPhraseMemoized(tenant.wordList.banned, comment.body)) {
    // Add the flag related to Trust to the comment.
    return {
      status: GQLCOMMENT_STATUS.REJECTED,
      actions: [
        {
          userID: null,
          actionType: ACTION_TYPE.FLAG,
          reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_BANNED_WORD,
        },
      ],
    };
  }

  // If the comment has a suspect word or a link, we need to add a
  // flag to it to indicate that it needs to be looked at.
  // Otherwise just return the new comment.

  // If the wordList has matched the suspect word filter and we haven't disabled
  // auto-flagging suspect words, then we should flag the comment!
  if (containsMatchingPhraseMemoized(tenant.wordList.suspect, comment.body)) {
    return {
      actions: [
        {
          userID: null,
          actionType: ACTION_TYPE.FLAG,
          reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_SUSPECT_WORD,
        },
      ],
    };
  }
};
