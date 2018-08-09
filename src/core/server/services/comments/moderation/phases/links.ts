import linkify from "linkify-it";
import tlds from "tlds";

import {
  GQLACTION_GROUP,
  GQLACTION_TYPE,
  GQLCOMMENT_STATUS,
} from "talk-server/graph/tenant/schema/__generated__/types";
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
  asset,
  tenant,
  comment,
}): IntermediatePhaseResult | void => {
  if (
    testPremodLinksEnable(tenant, comment.body) ||
    (asset.settings && testPremodLinksEnable(asset.settings, comment.body))
  ) {
    // Add the flag related to Trust to the comment.
    return {
      status: GQLCOMMENT_STATUS.SYSTEM_WITHHELD,
      actions: [
        {
          action_type: GQLACTION_TYPE.FLAG,
          group_id: GQLACTION_GROUP.LINKS,
          metadata: {
            links: comment.body,
          },
        },
      ],
    };
  }
};
