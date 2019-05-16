import { GQLCommentRevisionTypeResolver } from "coral-server/graph/tenant/schema/__generated__/types";
import { decodeActionCounts } from "coral-server/models/action/comment";
import { Comment, Revision } from "coral-server/models/comment";

export interface WrappedCommentRevision {
  revision: Revision;
  comment: Comment;
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
