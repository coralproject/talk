import { decodeActionCounts } from "coral-server/models/action/comment";
import { Comment, Revision } from "coral-server/models/comment";

import { GQLCommentRevisionResolvers } from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";
import RequiredResolver from "./RequireResolver";

export interface WrappedCommentRevision {
  revision: Revision;
  comment: Comment;
}

export const CommentRevision: RequiredResolver<
  GQLCommentRevisionResolvers<GraphContext, WrappedCommentRevision>
> = {
  id: (w) => {
    return w.revision.id;
  },
  comment: (w) => w.comment,
  actionCounts: (w) => decodeActionCounts(w.revision.actionCounts),
  body: (w) => w.revision.body,
  // Defaults to an empty object if not set on the revision.
  metadata: (w) => w.revision.metadata || {},
  createdAt: (w) => w.revision.createdAt,
  media: (w) => w.revision.media,
};
