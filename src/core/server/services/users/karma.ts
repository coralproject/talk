import { get } from "lodash";

import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";

export const getCommentTrustScore = (user: User): number =>
  get(user, "metadata.trust.comment.karma", 0);

export const isReliableCommenter = (
  tenant: Tenant,
  user: User
): boolean | null => {
  const score = getCommentTrustScore(user);

  // TODO: (wyattjoh) use thresholds defined from the Tenant.
  if (score >= 1) {
    return true;
  } else if (score <= -1) {
    return false;
  }

  return null;
};
