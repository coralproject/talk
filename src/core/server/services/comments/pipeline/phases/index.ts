import { IntermediateModerationPhase } from "talk-server/services/comments/pipeline";

import { commentingDisabled } from "./commentingDisabled";
import { commentLength } from "./commentLength";
import { detectLinks } from "./detectLinks";
import { karma } from "./karma";
import { linkify } from "./linkify";
import { preModerate } from "./preModerate";
import { purify } from "./purify";
import { spam } from "./spam";
import { staff } from "./staff";
import { storyClosed } from "./storyClosed";
import { toxic } from "./toxic";
import { wordList } from "./wordList";

/**
 * The moderation phases to apply for each comment being processed.
 */
export const moderationPhases: IntermediateModerationPhase[] = [
  commentLength,
  storyClosed,
  commentingDisabled,
  linkify,
  purify,
  detectLinks,
  wordList,
  staff,
  karma,
  spam,
  toxic,
  preModerate,
];
