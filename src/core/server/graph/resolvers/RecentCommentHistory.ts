import { GQLRecentCommentHistoryTypeResolver } from "coral-server/graph/schema/__generated__/types";

export interface RecentCommentHistoryInput {
  userID: string;
}

export const RecentCommentHistory: Required<
  GQLRecentCommentHistoryTypeResolver<RecentCommentHistoryInput>
> = {
  statuses: ({ userID }, args, ctx) =>
    ctx.loaders.Comments.authorStatusCounts.load(userID),
};
