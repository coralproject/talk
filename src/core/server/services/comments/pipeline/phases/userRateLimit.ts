import { DateTime } from "luxon";

import { COMMENT_LIMIT_WINDOW_SECONDS } from "coral-common/constants";
import { RateLimitExceeded } from "coral-server/errors";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
  ModerationPhaseContext,
} from "coral-server/services/comments/pipeline";
import { retrieveUserLastWroteCommentTimestamp } from "coral-server/services/users";

export const userRateLimit: IntermediateModerationPhase = async ({
  action,
  author,
  redis,
  config,
  tenant,
  now,
}: Pick<
  ModerationPhaseContext,
  "author" | "redis" | "config" | "now" | "tenant" | "action"
>): Promise<IntermediatePhaseResult | void> => {
  // If we're in development mode and rate limiters are disabled, then just
  // continue anyways now.
  if (
    config.get("env") === "development" &&
    config.get("disable_rate_limiters")
  ) {
    return;
  }

  // If this is an edit, we don't need to process this again here.
  if (action === "EDIT") {
    return;
  }

  // Check when the last comment was written by this user.
  const timestamp = await retrieveUserLastWroteCommentTimestamp(
    redis,
    tenant,
    author
  );
  if (!timestamp) {
    // There is no timestamp written for this user, they are definitely allowed
    // to write a comment!
    return;
  }

  // Check to see if this timestamp is still within the limit window. If it is,
  // reject the comment.
  const nextEditTime = DateTime.fromJSDate(timestamp)
    .plus({ seconds: COMMENT_LIMIT_WINDOW_SECONDS })
    .toJSDate();
  if (nextEditTime > now) {
    throw new RateLimitExceeded("createComment", 1, nextEditTime);
  }

  return;
};
