import {
  GQLCOMMENT_STATUS,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

import { Comment } from "./comment";
import { MODERATOR_STATUSES, PUBLISHED_STATUSES } from "./constants";
import {
  calculateTotalPublishedCommentCount,
  CommentStatusCounts,
} from "./counts";
import { Revision } from "./revision";

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
 * hasPublishedStatus will check to see if the comment has a visibility status
 * where readers could see it.
 *
 * @param comment the comment to check the status on
 */
export function hasPublishedStatus(comment: Pick<Comment, "status">): boolean {
  return PUBLISHED_STATUSES.includes(comment.status);
}

export function hasModeratorStatus(comment: Pick<Comment, "status">): boolean {
  return MODERATOR_STATUSES.includes(comment.status);
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

export function hasRevision(
  comment: Pick<Comment, "revisions">,
  revisionID: string
): boolean {
  return comment.revisions.some((revision) => revision.id === revisionID);
}

export function calculateRejectionRate(counts: CommentStatusCounts): number {
  const published = calculateTotalPublishedCommentCount(counts);
  const rejected = counts[GQLCOMMENT_STATUS.REJECTED];

  return rejected / (published + rejected);
}

export function hasTag(comment: Pick<Comment, "tags">, tag: GQLTAG) {
  return comment.tags.some((v) => v.type === tag);
}

/**
 * getDepth will return the depth of the comment.
 *
 * @param comment the comment to check for depth
 */
export function getDepth(
  comment: Pick<Comment, "ancestorIDs" | "parentID">
): number {
  return hasAncestors(comment) ? comment.ancestorIDs.length : 0;
}
