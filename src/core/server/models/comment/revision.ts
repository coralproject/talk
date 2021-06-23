import {
  ACTION_TYPE,
  EncodedCommentActionCounts,
  FLAG_REASON,
} from "coral-server/models/action/comment";

import {
  GQLCOMMENT_STATUS,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

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
   * wordList metadata stores extra status details about what occurred during
   * word list analysis of this comment revision.
   */
  wordList?: {
    /**
     * timedOut is whether the wordlist analysis timed out when this revision
     * of the comment was sent through the moderation phases.
     */
    timedOut?: boolean;
  };

  /**
   * nudge when true indicates that the comment was written on the first try
   * without a warning.
   */
  nudge?: boolean;

  /**
   * externalModeration is any details about if and when this comment revision
   * was analyzed by an external moderation phase.
   */
  externalModeration?: {
    name: string;
    analyzedAt: Date;
    result: {
      status?: GQLCOMMENT_STATUS;
      tags?: GQLTAG[];
      actions?: {
        type?: ACTION_TYPE;
        reason?: FLAG_REASON;
      }[];
    };
  }[];
}

export interface GiphyMedia {
  type: "giphy";
  id: string;
  url: string;
  original: string;
  still: string;
  video: string;
  width?: number;
  height?: number;
  title?: string;
}

export interface TwitterMedia {
  type: "twitter";
  url: string;
  width?: number;
}

export interface YouTubeMedia {
  type: "youtube";
  url: string;
  still: string;
  title?: string;
  width?: number;
  height?: number;
}

export interface ExternalMedia {
  type: "external";
  url: string;
  width?: number;
  height?: number;
}

export type CommentMedia =
  | GiphyMedia
  | TwitterMedia
  | YouTubeMedia
  | ExternalMedia;

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

  /**
   * media is the optional media object attached to this revision.
   */
  media?: CommentMedia;
}
