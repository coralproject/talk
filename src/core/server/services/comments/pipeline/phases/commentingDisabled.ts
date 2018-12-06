import { ModerationSettings } from "talk-server/models/settings";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "talk-server/services/comments/pipeline";

const testDisabledCommenting = (settings: Partial<ModerationSettings>) =>
  settings.disableCommenting;

export const commentingDisabled: IntermediateModerationPhase = ({
  story,
  tenant,
}): IntermediatePhaseResult | void => {
  // Check to see if the story has closed commenting.
  if (
    testDisabledCommenting(tenant) ||
    (story.settings && testDisabledCommenting(story.settings))
  ) {
    // TODO: (wyattjoh) return better error.
    throw new Error("commenting has been disabled tenant wide");
  }
};
