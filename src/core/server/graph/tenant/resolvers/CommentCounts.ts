import { GQLCommentCountsTypeResolver } from "coral-server/graph/tenant/schema/__generated__/types";
import { VISIBLE_STATUSES } from "coral-server/models/comment/constants";
import { CommentStatusCounts } from "coral-server/models/story";

export const CommentCounts: GQLCommentCountsTypeResolver<
  CommentStatusCounts
> = {
  totalVisible: commentCounts =>
    VISIBLE_STATUSES.reduce(
      (total, status) => total + commentCounts[status],
      0
    ),
  statuses: commentCounts => commentCounts,
};
