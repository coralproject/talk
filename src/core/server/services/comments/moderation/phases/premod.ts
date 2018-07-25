import {
  GQLCOMMENT_STATUS,
  GQLMODERATION_MODE,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { ModerationSettings } from "talk-server/models/tenant";
import { IntermediateModerationPhase } from "talk-server/services/comments/moderation";

const testModerationMode = (settings: Partial<ModerationSettings>) =>
  settings.moderation === GQLMODERATION_MODE.PRE;

// This phase checks to see if the settings have premod enabled, if they do,
// the comment is premod, otherwise, it's just none.
export const premod: IntermediateModerationPhase = (asset, tenant) => {
  // If the settings say that we're in premod mode, then the comment is in
  // premod status.

  // TODO: (wyattjoh) pull from the asset settings.
  if (
    testModerationMode(tenant) ||
    (asset.settings && testModerationMode(asset.settings))
  ) {
    return {
      status: GQLCOMMENT_STATUS.PREMOD,
    };
  }

  return;
};
