import { calculateTotalPublishedCommentCount } from "coral-server/models/comment";
import { Story } from "coral-server/models/story";

import { GQLCommentCountsTypeResolver } from "coral-server/graph/schema/__generated__/types";

export type CommentCountsInput = Pick<Story, "commentCounts" | "id">;

export const CommentCounts: GQLCommentCountsTypeResolver<CommentCountsInput> = {
  totalPublished: ({ commentCounts }) =>
    calculateTotalPublishedCommentCount(commentCounts.status),
  statuses: ({ commentCounts }) => commentCounts.status,
  tags: (s, input, ctx) => ctx.loaders.Comments.tagCounts.load(s.id),
  seenCount: async ({ id: storyID }, input, ctx) => {
    if (!ctx.user) {
      return 0;
    }

    const seenComments = await ctx.loaders.SeenComments.find.load({
      storyID,
      userID: ctx.user.id,
    });

    const seenCount = seenComments
      ? Object.keys(seenComments.comments)?.length ?? 0
      : 0;

    return seenCount;
  },
};
