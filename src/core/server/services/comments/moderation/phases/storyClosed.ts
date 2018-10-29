import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "talk-server/services/comments/moderation";

// This phase checks to see if the story being processed is closed or not.
export const storyClosed: IntermediateModerationPhase = ({
  story,
}): IntermediatePhaseResult | void => {
  // Check to see if the story has closed commenting...
  if (story.closedAt && story.closedAt.valueOf() <= Date.now()) {
    // TODO: (wyattjoh) return better error.
    throw new Error("story is currently closed for commenting");
  }
};
