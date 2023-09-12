import { CommentingDisabledError } from "coral-server/errors";
import { Settings } from "coral-server/models/settings";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

const testDisabledCommenting = (settings: Settings) =>
  settings.disableCommenting && settings.disableCommenting.enabled;

export const commentingDisabled: IntermediateModerationPhase = ({
  tenant,
}): IntermediatePhaseResult | void => {
  if (testDisabledCommenting(tenant)) {
    throw new CommentingDisabledError();
  }
};
