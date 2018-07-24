import { IntermediateModerationPhase } from "talk-server/services/comments/moderation";

export const commentingDisabled: IntermediateModerationPhase = (
  asset,
  tenant
) => {
  // Check to see if the asset has closed commenting.
  if (tenant.disableCommenting) {
    // TODO: (wyattjoh) return better error.
    throw new Error("commenting has been disabled tenant wide");
  }
};
