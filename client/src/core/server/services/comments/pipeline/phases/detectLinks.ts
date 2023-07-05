import { DeepPartial } from "coral-common/types";
import { ACTION_TYPE } from "coral-server/models/action/comment";
import { RevisionMetadata } from "coral-server/models/comment";
import { GlobalModerationSettings } from "coral-server/models/settings";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

import {
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_STATUS,
} from "coral-server/graph/schema/__generated__/types";

const testPremodLinksEnable = (
  settings: DeepPartial<GlobalModerationSettings>,
  metadata: RevisionMetadata
) => settings.premodLinksEnable && metadata && metadata.linkCount;

// This phase checks the comment if it has any links in it if the check is
// enabled.
export const detectLinks: IntermediateModerationPhase = ({
  story,
  tenant,
  metadata,
}): IntermediatePhaseResult | void => {
  if (
    testPremodLinksEnable(tenant, metadata) ||
    (story.settings && testPremodLinksEnable(story.settings, metadata))
  ) {
    // Add the flag related to Trust to the comment.
    return {
      status: GQLCOMMENT_STATUS.SYSTEM_WITHHELD,
      actions: [
        {
          actionType: ACTION_TYPE.FLAG,
          reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_LINKS,
        },
      ],
    };
  }
};
