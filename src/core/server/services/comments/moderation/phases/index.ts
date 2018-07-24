import { IntermediateModerationPhase } from "talk-server/services/comments/moderation";

import { assetClosed } from "./assetClosed";
import { commentingDisabled } from "./commentingDisabled";
import { commentLength } from "./commentLength";

/**
 * The moderation phases to apply for each comment being processed.
 */
export const moderationPhases: IntermediateModerationPhase[] = [
  commentLength,
  assetClosed,
  commentingDisabled,
];
