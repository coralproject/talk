import {
  GQLCOMMENT_STATUS,
  GQLMODERATION_MODE,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { IntermediateModerationPhase } from "talk-server/services/comments/moderation";

// This phase checks to see if the settings have premod enabled, if they do,
// the comment is premod, otherwise, it's just none.
export const premod: IntermediateModerationPhase = (
  asset,
  tenant,
  comment,
  author
) => {
  // If the settings say that we're in premod mode, then the comment is in
  // premod status.

  // TODO: (wyattjoh) pull from the asset settings.
  if (tenant.moderation === GQLMODERATION_MODE.PRE) {
    return {
      status: GQLCOMMENT_STATUS.PREMOD,
    };
  }

  return;
};
