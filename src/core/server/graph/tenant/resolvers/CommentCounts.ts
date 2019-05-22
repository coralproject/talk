import {
  GQLCOMMENT_STATUS,
  GQLCommentCountsTypeResolver,
} from "coral-server/graph/tenant/schema/__generated__/types";
import { CommentStatusCounts } from "coral-server/models/story";

export const CommentCounts: GQLCommentCountsTypeResolver<
  CommentStatusCounts
> = {
  totalVisible: commentCounts =>
    commentCounts[GQLCOMMENT_STATUS.ACCEPTED] +
    commentCounts[GQLCOMMENT_STATUS.NONE],
  statuses: commentCounts => commentCounts,
};
