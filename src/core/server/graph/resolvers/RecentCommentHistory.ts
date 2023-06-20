import { GQLRecentCommentHistoryResolvers } from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";
import RequiredResolver from "./RequireResolver";

export interface RecentCommentHistoryInput {
  userID: string;
}

export const RecentCommentHistory: RequiredResolver<
  GQLRecentCommentHistoryResolvers<GraphContext, RecentCommentHistoryInput>
> = {
  statuses: ({ userID }, args, ctx) =>
    ctx.loaders.Comments.authorStatusCounts.load(userID),
};
