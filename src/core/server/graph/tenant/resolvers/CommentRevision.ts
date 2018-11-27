import { GQLCommentRevisionTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import { decodeActionCounts } from "talk-server/models/action/comment";
import * as comment from "talk-server/models/comment";

export interface WrappedCommentRevision {
  revision: comment.Revision;
  comment: comment.Comment;
}

export const CommentRevision: Required<
  GQLCommentRevisionTypeResolver<WrappedCommentRevision>
> = {
  id: w => w.revision.id,
  comment: w => w.comment,
  actionCounts: w => decodeActionCounts(w.revision.actionCounts),
  body: w => w.revision.body,
  createdAt: w => w.revision.createdAt,
};
