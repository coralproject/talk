import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "talk-server/services/comments/pipeline";
import { getStoryClosedAt } from "talk-server/services/stories";

// This phase checks to see if the story being processed is closed or not.
export const storyClosed: IntermediateModerationPhase = ({
  story,
  tenant,
}): IntermediatePhaseResult | void => {
  const closedAt = getStoryClosedAt(tenant, story);
  if (closedAt && closedAt.valueOf() <= Date.now()) {
    // TODO: (wyattjoh) return better error.
    throw new Error("story is currently closed for commenting");
  }
};
