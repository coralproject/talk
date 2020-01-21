import { EncodedCommentActionCounts } from "coral-server/models/action/comment";

export interface RevisionMetadata {
  /**
   * akismet is true when it was determined to be spam.
   */
  akismet?: boolean;

  /**
   * linkCount is the number of links in a revision body that was detected.
   */
  linkCount?: number;

  /**
   * perspective stores the detected properties from checking with the
   * perspective model.
   */
  perspective?: {
    /**
     * score is the percentage likelihood (in decimal form) that the comment
     * matches the selected model.
     */
    score: number;

    /**
     * model is the perspective model used to determine the above score.
     */
    model: string;
  };

  /**
   * nudge when true indicates that the comment was written on the first try
   * without a warning.
   */
  nudge?: boolean;
}

/**
 * Revision stores a Comment's body for a specific edit. Actions can be tied to
 * a Revision, as can moderation actions.
 */
export interface Revision {
  /**
   * id identifies this Revision.
   */
  readonly id: string;

  /**
   * body is the body text for this revision.
   */
  body: string;

  /**
   * actionCounts is the cached action counts on this revision.
   */
  actionCounts: EncodedCommentActionCounts;

  /**
   * metadata stores properties on this revision.
   */
  metadata: RevisionMetadata;

  /**
   * createdAt is the date that this revision was created at.
   */
  createdAt: Date;
}
