import { get } from "lodash";

import { KarmaThresholds } from "talk-server/models/settings";
import { User } from "talk-server/models/user";

export const getCommentTrustScore = (user: User): number =>
  get(user, "metadata.trust.comment.karma", 0);

export const isReliableCommenter = (
  thresholds: KarmaThresholds,
  user: User
): boolean | null => {
  const score = getCommentTrustScore(user);

  if (score >= thresholds.comment.reliable) {
    return true;
  } else if (score <= thresholds.comment.unreliable) {
    return false;
  }

  return null;
};
