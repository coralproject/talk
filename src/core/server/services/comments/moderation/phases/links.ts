import linkify from "linkify-it";
import tlds from "tlds";

import {
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_STATUS,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { ACTION_TYPE } from "talk-server/models/action/comment";
import { ModerationSettings } from "talk-server/models/settings";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "talk-server/services/comments/moderation";

/**
 * The preloaded linkify instance with common tlds.
 */
const testForLinks = linkify().tlds(tlds);

const testPremodLinksEnable = (
  settings: Partial<ModerationSettings>,
  body: string
) => settings.premodLinksEnable && testForLinks.test(body);

// This phase checks the comment if it has any links in it if the check is
// enabled.
export const links: IntermediateModerationPhase = ({
  story,
  tenant,
  comment,
}): IntermediatePhaseResult | void => {
  if (
    comment.body &&
    (testPremodLinksEnable(tenant, comment.body) ||
      (story.settings && testPremodLinksEnable(story.settings, comment.body)))
  ) {
    // Add the flag related to Trust to the comment.
    return {
      status: GQLCOMMENT_STATUS.SYSTEM_WITHHELD,
      actions: [
        {
          userID: null,
          actionType: ACTION_TYPE.FLAG,
          reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_LINKS,
          metadata: {
            links: comment.body,
          },
        },
      ],
    };
  }
};
