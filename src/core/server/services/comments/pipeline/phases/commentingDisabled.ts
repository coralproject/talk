import { CommentingDisabledError } from "coral-server/errors";
import { Settings } from "coral-server/models/settings";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

const testDisabledCommenting = (settings: Partial<Settings>) =>
  settings.disableCommenting && settings.disableCommenting.enabled;

export const commentingDisabled: IntermediateModerationPhase = ({
  story,
  tenant,
}): IntermediatePhaseResult | void => {
  // Check to see if the story has closed commenting.
  if (
    testDisabledCommenting(tenant) ||
    (story.settings && testDisabledCommenting(story.settings))
  ) {
    throw new CommentingDisabledError();
  }
};
