import { IntermediateModerationPhase } from "talk-server/services/comments/moderation";

import { premod } from "talk-server/services/comments/moderation/phases/premod";
import { toxic } from "talk-server/services/comments/moderation/phases/toxic";
import { commentingDisabled } from "./commentingDisabled";
import { commentLength } from "./commentLength";
import { karma } from "./karma";
import { links } from "./links";
import { spam } from "./spam";
import { staff } from "./staff";
import { storyClosed } from "./storyClosed";
import { wordlist } from "./wordlist";

/**
 * The moderation phases to apply for each comment being processed.
 */
export const moderationPhases: IntermediateModerationPhase[] = [
  commentLength,
  storyClosed,
  commentingDisabled,
  wordlist,
  staff,
  links,
  karma,
  spam,
  toxic,
  premod,
];
