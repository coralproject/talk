import { EncodedCommentActionCounts } from "coral-server/models/action/comment";

import { GQLCOMMENT_STATUS } from "coral-server/graph/tenant/schema/__generated__/types";

export interface RevisionMetadata {
  akismet?: boolean;
  linkCount?: number;
  perspective?: {
    score: number;
    model: string;
  };
}

export interface RevisionStatusHistoryEntry {
  /**
   * id is the ID of the CommentModerationAction created for this particular
   * status change.
   */
  readonly id: string | null;

  /**
   * status is the GQLCOMMENT_STATUS assigned by the moderator for this
   * moderation action.
   */
  status: GQLCOMMENT_STATUS;

  /**
   * moderatorID is the ID of the User that created the moderation action. If
   * null, it indicates that it was created by the system rather than a User.
   */
  moderatorID: string | null;

  /**
   * createdAt is the time that the moderation action was created on.
   */
  createdAt: Date;
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
   * statusHistory is the history of status changes associated with this
   * Comment. The current comment status should always be directly related to
   * the last revision's last status history entry's status.
   */
  statusHistory: RevisionStatusHistoryEntry[];

  /**
   * createdAt is the date that this revision was created at.
   */
  createdAt: Date;
}
