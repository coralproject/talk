import { ACTION_TYPE } from "coral-server/models/action/comment";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

import {
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_STATUS,
} from "coral-server/graph/schema/__generated__/types";

import { WordList } from "../wordList";

// Create a new wordlist instance to use.
const list = new WordList();

// This phase checks the comment against the wordList.
export const wordList: IntermediateModerationPhase = ({
  tenant,
  comment,
  htmlStripped,
}): IntermediatePhaseResult | void => {
  // If there isn't a body, there can't be a bad word!
  if (!comment.body) {
    return;
  }

  // Decide the status based on whether or not the current story/settings
  // has pre-mod enabled or not. If the comment was rejected based on the
  // wordList, then reject it, otherwise if the moderation setting is
  // premod, set it to `premod`.
  if (list.test(tenant, "banned", htmlStripped)) {
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
  if (list.test(tenant, "suspect", htmlStripped)) {
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
