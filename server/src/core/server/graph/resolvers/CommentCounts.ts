import {
  calculateTotalPublishedAndVisibleCommentCount,
  calculateTotalPublishedCommentCount,
} from "coral-server/models/comment";
import { Story } from "coral-server/models/story";

import { GQLCommentCountsTypeResolver } from "coral-server/graph/schema/__generated__/types";

export type CommentCountsInput = Pick<Story, "commentCounts" | "id">;

export const CommentCounts: GQLCommentCountsTypeResolver<CommentCountsInput> = {
  totalPublished: ({ commentCounts }) =>
    calculateTotalPublishedCommentCount(commentCounts.status),
  totalPublishedAndVisible: ({ commentCounts }) =>
    calculateTotalPublishedAndVisibleCommentCount(commentCounts),
  statuses: ({ commentCounts }) => commentCounts.status,
  tags: (s, input, ctx) => ctx.loaders.Comments.tagCounts.load(s.id),
  relationships: ({ commentCounts }) => commentCounts.relationships,
};
