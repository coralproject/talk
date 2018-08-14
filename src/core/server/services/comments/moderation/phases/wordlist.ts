import {
  GQLACTION_GROUP,
  GQLACTION_TYPE,
  GQLCOMMENT_STATUS,
} from "talk-server/graph/tenant/schema/__generated__/types";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "talk-server/services/comments/moderation";
import { containsMatchingPhrase } from "talk-server/services/comments/moderation/wordlist";

// This phase checks the comment against the wordlist.
export const wordlist: IntermediateModerationPhase = ({
  tenant,
  comment,
}): IntermediatePhaseResult | void => {
  // Decide the status based on whether or not the current asset/settings
  // has pre-mod enabled or not. If the comment was rejected based on the
  // wordlist, then reject it, otherwise if the moderation setting is
  // premod, set it to `premod`.
  if (containsMatchingPhrase(tenant.wordlist.banned, comment.body)) {
    // Add the flag related to Trust to the comment.
    return {
      status: GQLCOMMENT_STATUS.REJECTED,
      actions: [
        {
          action_type: GQLACTION_TYPE.FLAG,
          group_id: GQLACTION_GROUP.BANNED_WORD,
        },
      ],
    };
  }

  // If the comment has a suspect word or a link, we need to add a
  // flag to it to indicate that it needs to be looked at.
  // Otherwise just return the new comment.

  // If the wordlist has matched the suspect word filter and we haven't disabled
  // auto-flagging suspect words, then we should flag the comment!
  if (containsMatchingPhrase(tenant.wordlist.suspect, comment.body)) {
    return {
      actions: [
        {
          action_type: GQLACTION_TYPE.FLAG,
          group_id: GQLACTION_GROUP.SUSPECT_WORD,
        },
      ],
    };
  }
};
