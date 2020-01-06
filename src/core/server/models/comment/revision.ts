import { EncodedCommentActionCounts } from "coral-server/models/action/comment";

export interface RevisionMetadata {
  akismet?: boolean;
  linkCount?: number;
  perspective?: {
    score: number;
    model: string;
  };
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
