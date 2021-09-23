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
  config,
  tenant,
  comment,
}): IntermediatePhaseResult | void => {
  // If there isn't a body, there can't be a bad word!
  if (!comment.body) {
    return;
  }

  // Get the timeout to use.
  const timeout = config.get("word_list_timeout");

  // Test the comment for banned words.
  const banned = list.test(tenant, "banned", timeout, comment.body);
  if (banned.isMatched) {
    return {
      status: GQLCOMMENT_STATUS.REJECTED,
      actions: [
        {
          actionType: ACTION_TYPE.FLAG,
          reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_BANNED_WORD,
        },
      ],
      metadata: {
        wordList: {
          bannedWords: banned.matches,
        },
      },
    };
  } else if (banned.timedOut) {
    return {
      actions: [
        {
          actionType: ACTION_TYPE.FLAG,
          reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_BANNED_WORD,
        },
      ],
      metadata: {
        wordList: {
          timedOut: true,
        },
      },
    };
  }

  // Test the comment for suspect words.
  const suspect = list.test(tenant, "suspect", timeout, comment.body);

  if (tenant.premoderateSuspectWords && suspect.isMatched) {
    return {
      status: GQLCOMMENT_STATUS.SYSTEM_WITHHELD,
      actions: [
        {
          actionType: ACTION_TYPE.FLAG,
          reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_SUSPECT_WORD,
        },
      ],
      metadata: {
        wordList: {
          suspectWords: suspect.matches,
        },
      },
    };
  } else if (suspect.isMatched) {
    return {
      actions: [
        {
          actionType: ACTION_TYPE.FLAG,
          reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_SUSPECT_WORD,
        },
      ],
      metadata: {
        wordList: {
          suspectWords: suspect.matches,
        },
      },
    };
  } else if (suspect.timedOut) {
    return {
      actions: [
        {
          actionType: ACTION_TYPE.FLAG,
          reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_SUSPECT_WORD,
        },
      ],
      metadata: {
        wordList: {
          timedOut: true,
        },
      },
    };
  }
};
