import { GQLCOMMENT_STATUS } from "coral-server/graph/tenant/schema/__generated__/types";

/**
 * VISIBLE_STATUSES are the comment statuses that a Comment may have that would
 * make it visible to readers.
 */
export const VISIBLE_STATUSES = [
  GQLCOMMENT_STATUS.NONE,
  GQLCOMMENT_STATUS.ACCEPTED,
];
