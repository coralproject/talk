import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "talk-server/services/comments/pipeline";

// This phase checks to see if the story being processed is closed or not.
export const storyClosed: IntermediateModerationPhase = ({
  story,
  tenant,
}): IntermediatePhaseResult | void => {
  if (story.closedAt && story.closedAt.valueOf() <= Date.now()) {
    // TODO: (wyattjoh) return better error.
    throw new Error("story is currently closed for commenting");
  }

  if (
    story.closedAt !== false &&
    tenant.autoCloseStream &&
    tenant.closedTimeout &&
    story.createdAt.valueOf() + tenant.closedTimeout <= Date.now()
  ) {
    // TODO: (wyattjoh) return better error.
    throw new Error("story is currently closed for commenting");
  }
};
