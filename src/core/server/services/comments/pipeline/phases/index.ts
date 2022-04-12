import { IntermediateModerationPhase } from "coral-server/services/comments/pipeline";

import { approveExpertAnswers } from "./approveExpertAnswers";
import { approveRatings } from "./approveRatings";
import { approveStaff } from "./approveStaff";
import { commentingDisabled } from "./commentingDisabled";
import { commentLength } from "./commentLength";
import { detectLinks } from "./detectLinks";
import { external } from "./external";
import { linkify } from "./linkify";
import { purify } from "./purify";
import { recentCommentHistory } from "./recentCommentHistory";
import { repeatPost } from "./repeatPost";
import { spam } from "./spam";
import { statusPreModerate } from "./statusPreModerate";
import { statusPreModerateNewCommenter } from "./statusPreModerateNewCommenter";
import { statusPreModerateUser } from "./statusPreModerateUser";
import { storyClosed } from "./storyClosed";
import { tagExpertAnswers } from "./tagExpertAnswers";
import { tagMember } from "./tagMember";
import { tagQuestion } from "./tagQuestion";
import { tagReview } from "./tagReview";
import { tagStaff } from "./tagStaff";
import { tagUnansweredQuestions } from "./tagUnansweredQuestions";
import { toxic } from "./toxic";
import { wordList } from "./wordList";

/**
 * The moderation phases to apply for each comment being processed.
 */
export const moderationPhases: IntermediateModerationPhase[] = [
  // Prevent any comment that has no content from being posted.
  commentLength,

  // Prevent any comments from being posted when all commenting is disabled.
  storyClosed,
  commentingDisabled,

  // Parse + validate the content in the comments that appear.
  linkify,
  purify,
  repeatPost,

  // Add any tags to comments.
  tagReview,
  tagQuestion,
  tagExpertAnswers,
  tagStaff,
  tagMember,
  tagUnansweredQuestions,

  // Approve any comment here that should be approved before running through
  // content checkers.
  approveStaff,
  approveExpertAnswers,
  approveRatings,

  // Run any content checking filters.
  wordList,
  toxic,
  recentCommentHistory,
  spam,
  detectLinks,

  // Apply any pre-existing conditions to these comments.
  statusPreModerateNewCommenter,
  statusPreModerate,
  statusPreModerateUser,

  // Run any external moderation phase that missed other filters.
  external,
];
