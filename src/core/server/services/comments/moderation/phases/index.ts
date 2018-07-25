import { IntermediateModerationPhase } from "talk-server/services/comments/moderation";

import { assetClosed } from "./assetClosed";
import { commentingDisabled } from "./commentingDisabled";
import { commentLength } from "./commentLength";
import { karma } from "./karma";
import { links } from "./links";
import { staff } from "./staff";
import { wordlist } from "./wordlist";

/**
 * The moderation phases to apply for each comment being processed.
 */
export const moderationPhases: IntermediateModerationPhase[] = [
  commentLength,
  assetClosed,
  commentingDisabled,
  wordlist,
  staff,
  links,
  karma,
];
