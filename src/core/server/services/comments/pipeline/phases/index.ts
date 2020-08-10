import { IntermediateModerationPhase } from "coral-server/services/comments/pipeline";

import { approve } from "./approve";
import { commentingDisabled } from "./commentingDisabled";
import { commentLength } from "./commentLength";
import { detectLinks } from "./detectLinks";
import { external } from "./external";
import { linkify } from "./linkify";
import { preModerate } from "./preModerate";
import { premodUser } from "./preModerateUser";
import { premodNewCommenter } from "./premodNewCommenter";
import { purify } from "./purify";
import { recentCommentHistory } from "./recentCommentHistory";
import { repeatPost } from "./repeatPost";
import { spam } from "./spam";
import { staff } from "./staff";
import { storyClosed } from "./storyClosed";
import { tagExpertAnswers } from "./tagExpertAnswers";
import { tagUnansweredQuestions } from "./tagUnansweredQuestions";
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
  repeatPost,
  tagExpertAnswers,
  staff,
  tagUnansweredQuestions,
  approve,
  wordList,
  toxic,
  recentCommentHistory,
  spam,
  detectLinks,
  preModerate,
  premodUser,
  premodNewCommenter,
  external,
];
