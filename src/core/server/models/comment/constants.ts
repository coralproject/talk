import { GQLCOMMENT_STATUS } from "coral-server/graph/tenant/schema/__generated__/types";

/**
 * PUBLISHED_STATUSES are the comment statuses that a Comment may have that would
 * make it visible to readers.
 */
export const PUBLISHED_STATUSES = [
  GQLCOMMENT_STATUS.NONE,
  GQLCOMMENT_STATUS.APPROVED,
];
