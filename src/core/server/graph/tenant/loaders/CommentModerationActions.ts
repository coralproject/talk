import TenantContext from "coral-server/graph/tenant/context";
import {
  CommentToStatusHistoryArgs,
  UserToCommentModerationActionHistoryArgs,
} from "coral-server/graph/tenant/schema/__generated__/types";
import { retrieveCommentModerationActionConnection } from "coral-server/models/action/moderation/comment";

export default (ctx: TenantContext) => ({
  forModerator: (
    { first = 10, after }: UserToCommentModerationActionHistoryArgs,
    moderatorID: string
  ) =>
    retrieveCommentModerationActionConnection(ctx.mongo, ctx.tenant.id, {
      first,
      after,
      filter: {
        moderatorID,
      },
    }),
  forComment: (
    { first = 10, after }: CommentToStatusHistoryArgs,
    commentID: string
  ) =>
    retrieveCommentModerationActionConnection(ctx.mongo, ctx.tenant.id, {
      first,
      after,
      filter: {
        commentID,
      },
    }),
});
