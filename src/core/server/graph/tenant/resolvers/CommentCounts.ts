import { GQLCommentCountsTypeResolver } from "coral-server/graph/tenant/schema/__generated__/types";
import {
  calculateTotalPublishedCommentCount,
  Story,
} from "coral-server/models/story";

export type CommentCountsInput = Pick<Story, "commentCounts" | "id">;

export const CommentCounts: GQLCommentCountsTypeResolver<CommentCountsInput> = {
  totalPublished: ({ commentCounts }) =>
    calculateTotalPublishedCommentCount(commentCounts.status),
  statuses: ({ commentCounts }) => commentCounts.status,
  tags: (s, input, ctx) => ctx.loaders.Comments.tagCounts.load(s.id),
};
