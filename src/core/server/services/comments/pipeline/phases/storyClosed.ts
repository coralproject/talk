import { StoryClosedError } from "coral-server/errors";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";
import { getStoryClosedAt } from "coral-server/services/stories";

// This phase checks to see if the story being processed is closed or not.
export const storyClosed: IntermediateModerationPhase = ({
  story,
  tenant,
  now,
}): IntermediatePhaseResult | void => {
  const closedAt = getStoryClosedAt(tenant, story);
  if (closedAt && closedAt <= now) {
    throw new StoryClosedError();
  }
};
