import { DeepPartial } from "coral-common/types";
import { GlobalModerationSettings } from "coral-server/models/settings";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

import {
  GQLCOMMENT_STATUS,
  GQLMODERATION_MODE,
} from "coral-server/graph/schema/__generated__/types";

const testModerationMode = (
  settings: DeepPartial<GlobalModerationSettings>,
  siteID: string
) => {
  return settings.moderation === GQLMODERATION_MODE.SPECIFIC_SITES_PRE
    ? settings.premoderateAllCommentsSites?.includes(siteID)
    : settings.moderation === GQLMODERATION_MODE.PRE;
};

// This phase checks to see if the settings have premod enabled, if they do,
// the comment is premod, otherwise, it's just none.
export const statusPreModerate: IntermediateModerationPhase = ({
  story,
  tenant,
}): IntermediatePhaseResult | void => {
  // If the settings say that we're in premod mode, then the comment is in
  // premod status.
  if (
    testModerationMode(tenant, story.siteID) ||
    (story.settings && testModerationMode(story.settings, story.siteID))
  ) {
    return {
      status: GQLCOMMENT_STATUS.PREMOD,
    };
  }
};
