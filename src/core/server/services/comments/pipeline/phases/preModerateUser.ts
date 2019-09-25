import { GQLCOMMENT_STATUS } from "coral-server/graph/tenant/schema/__generated__/types";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

// If a given user is set to always premod, set to premod.
export const premodUser: IntermediateModerationPhase = ({
  author,
}): IntermediatePhaseResult | void => {
  // FIXME: (wyattjoh) once migration has been performed, remove check
  if (author.status.premod && author.status.premod.active) {
    return {
      status: GQLCOMMENT_STATUS.PREMOD,
    };
  }
};
