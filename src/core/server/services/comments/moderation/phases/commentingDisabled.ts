import { ModerationSettings } from "talk-server/models/settings";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "talk-server/services/comments/moderation";

const testDisabledCommenting = (settings: Partial<ModerationSettings>) =>
  settings.disableCommenting;

export const commentingDisabled: IntermediateModerationPhase = ({
  asset,
  tenant,
}): IntermediatePhaseResult | void => {
  // Check to see if the asset has closed commenting.
  if (
    testDisabledCommenting(tenant) ||
    (asset.settings && testDisabledCommenting(asset.settings))
  ) {
    // TODO: (wyattjoh) return better error.
    throw new Error("commenting has been disabled tenant wide");
  }
};
