/**
 * COMMENT_TAG_TYPE is the type of tag that can be added to a Comment.
 */
export enum COMMENT_TAG_TYPE {
  /**
   * STAFF is used for comments written by staff members.
   */
  STAFF = "STAFF",

  /**
   * FEATURED is used when a given comment has been featured.
   */
  FEATURED = "FEATURED",
}

/**
 * COMMENT_TAG_TYPE_TRANSLATIONS is the set of translation keys associated with
 * a given
 */
export const COMMENT_TAG_TYPE_TRANSLATIONS: Record<COMMENT_TAG_TYPE, string> = {
  STAFF: "tags-staff",
  FEATURED: "tags-featured",
};

/**
 * CommentTag is used to represent a given Tag added to a Comment.
 */
export interface CommentTag {
  /**
   * type represents a specific tag that can be added to a Comment.
   */
  type: COMMENT_TAG_TYPE;

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
