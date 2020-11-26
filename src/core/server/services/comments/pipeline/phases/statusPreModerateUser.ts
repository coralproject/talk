import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

import { GQLCOMMENT_STATUS } from "coral-server/graph/schema/__generated__/types";

// If a given user is set to always premod, set to premod.
export const statusPreModerateUser: IntermediateModerationPhase = ({
  author,
}): IntermediatePhaseResult | void => {
  if (!author.status.premod.active) {
    return;
  }

  return {
    status: GQLCOMMENT_STATUS.PREMOD,
  };
};
