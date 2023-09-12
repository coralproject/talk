import { GQLTAG } from "coral-server/graph/schema/__generated__/types";

/**
 * CommentTag is used to represent a given Tag added to a Comment.
 */
export interface CommentTag {
  // TODO: (wyattjoh) rename `type` to `code`

  /**
   * type represents a specific tag that can be added to a Comment.
   */
  type: GQLTAG;

  /**
   * createdBy is the ID of the user that created the Tag. If this tag was
   * created by the system, this will be not provided.
   */
  createdBy?: string;

  /**
   * createdAt is the time that the tag was added to the Comment.
   */
  createdAt: Date;
}

export const STAFF_TAGS = [GQLTAG.STAFF, GQLTAG.ADMIN, GQLTAG.MODERATOR];
