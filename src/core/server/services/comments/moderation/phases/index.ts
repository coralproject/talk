import { IntermediateModerationPhase } from "talk-server/services/comments/moderation";

import { assetClosed } from "./assetClosed";
import { commentingDisabled } from "./commentingDisabled";
import { commentLength } from "./commentLength";
import { karma } from "./karma";
import { links } from "./links";
import { preModerate } from "./preModerate";
import { spam } from "./spam";
import { staff } from "./staff";
import { toxic } from "./toxic";
import { wordList } from "./wordList";

/**
 * The moderation phases to apply for each comment being processed.
 */
export const moderationPhases: IntermediateModerationPhase[] = [
  commentLength,
  assetClosed,
  commentingDisabled,
  wordList,
  staff,
  links,
  karma,
  spam,
  toxic,
  preModerate,
];
