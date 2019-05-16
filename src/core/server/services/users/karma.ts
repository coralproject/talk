import { get } from "lodash";

import { GQLKarmaThresholds } from "coral-server/graph/tenant/schema/__generated__/types";
import { User } from "coral-server/models/user";

export const getCommentTrustScore = (user: User): number =>
  get(user, "metadata.trust.comment.karma", 0);

export const isReliableCommenter = (
  thresholds: GQLKarmaThresholds,
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
