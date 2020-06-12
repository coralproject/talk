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
  bodyText,
}): IntermediatePhaseResult | void => {
  // If there isn't a body, there can't be a bad word!
  if (!comment.body) {
    return;
  }

  // Test the comment for banned words.
  const banned = list.test(tenant, "banned", bodyText);
  if (banned) {
    return {
      status: GQLCOMMENT_STATUS.REJECTED,
      actions: [
        {
          actionType: ACTION_TYPE.FLAG,
          reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_BANNED_WORD,
        },
      ],
    };
  } else if (banned === null) {
    return {
      status: GQLCOMMENT_STATUS.SYSTEM_WITHHELD,
      actions: [
        {
          actionType: ACTION_TYPE.FLAG,
          reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_BANNED_WORD,
        },
      ],
    };
  }

  // Test the comment for suspect words.
  const suspect = list.test(tenant, "suspect", bodyText);
  if (suspect) {
    return {
      actions: [
        {
          actionType: ACTION_TYPE.FLAG,
          reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_SUSPECT_WORD,
        },
      ],
    };
  } else if (suspect === null) {
    return {
      status: GQLCOMMENT_STATUS.SYSTEM_WITHHELD,
      actions: [
        {
          actionType: ACTION_TYPE.FLAG,
          reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_SUSPECT_WORD,
        },
      ],
    };
  }
};
