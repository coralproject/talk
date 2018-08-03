import { IntermediateModerationPhase } from "talk-server/services/comments/moderation";

// This phase checks to see if the asset being processed is closed or not.
export const assetClosed: IntermediateModerationPhase = ({ asset }) => {
  // Check to see if the asset has closed commenting...
  if (asset.closedAt && asset.closedAt.valueOf() <= Date.now()) {
    // TODO: (wyattjoh) return better error.
    throw new Error("asset is currently closed for commenting");
  }

  return;
};
