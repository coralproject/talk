import { GQLCOMMENT_STATUS } from "coral-server/graph/tenant/schema/__generated__/types";

import { Comment, Revision } from ".";
import { VISIBLE_STATUSES } from "./constants";

/**
 * hasAncestors will check to see if a given comment has any ancestors.
 *
 * @param comment the comment to check the ancestors on
 */
export function hasAncestors(
  comment: Pick<Comment, "ancestorIDs" | "parentID">
): comment is Required<Pick<Comment, "ancestorIDs" | "parentID">> {
  return Boolean(comment.ancestorIDs.length > 0);
}

/**
 * hasVisibleStatus will check to see if the comment has a visibility status
 * where readers could see it.
 *
 * @param comment the comment to check the status on
 */
export function hasVisibleStatus(comment: Pick<Comment, "status">): boolean {
  return VISIBLE_STATUSES.includes(comment.status);
}

/**
 * getLatestRevision will get the latest revision from a Comment.
 *
 * @param comment the comment that contains the revisions
 */
export function getLatestRevision(
  comment: Pick<Comment, "revisions">
): Revision {
  return comment.revisions[comment.revisions.length - 1];
}

// TODO: (wyattjoh) write a test to verify that this set of counts is always in sync with GQLCOMMENT_STATUS.

/**
 * CommentStatusCounts stores the count of Comments that have the particular
 * statuses.
 */
export interface CommentStatusCounts {
  [GQLCOMMENT_STATUS.APPROVED]: number;
  [GQLCOMMENT_STATUS.NONE]: number;
  [GQLCOMMENT_STATUS.PREMOD]: number;
  [GQLCOMMENT_STATUS.REJECTED]: number;
  [GQLCOMMENT_STATUS.SYSTEM_WITHHELD]: number;
}

export function createEmptyCommentStatusCounts(): CommentStatusCounts {
  return {
    [GQLCOMMENT_STATUS.APPROVED]: 0,
    [GQLCOMMENT_STATUS.NONE]: 0,
    [GQLCOMMENT_STATUS.PREMOD]: 0,
    [GQLCOMMENT_STATUS.REJECTED]: 0,
    [GQLCOMMENT_STATUS.SYSTEM_WITHHELD]: 0,
  };
}
