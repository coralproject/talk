import { GQLCommentCountsTypeResolver } from "coral-server/graph/tenant/schema/__generated__/types";
import { VISIBLE_STATUSES } from "coral-server/models/comment/constants";
import { Story } from "coral-server/models/story";

export type CommentCountsInput = Pick<Story, "commentCounts" | "id">;

export const CommentCounts: GQLCommentCountsTypeResolver<CommentCountsInput> = {
  totalVisible: ({ commentCounts }) =>
    VISIBLE_STATUSES.reduce(
      (total, status) => total + commentCounts.status[status],
      0
    ),
  statuses: ({ commentCounts }) => commentCounts.status,
  tags: (s, input, ctx) => ctx.loaders.Comments.tagCounts.load(s.id),
};
