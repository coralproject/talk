import TenantContext from "talk-server/graph/tenant/context";
import {
  CommentModerationActionFilter,
  retrieveCommentModerationActionConnection,
  retrieveCommentModerationActions,
} from "talk-server/models/action/moderation/comment";
import { UserToCommentModerationActionHistoryArgs } from "../schema/__generated__/types";

export default (ctx: TenantContext) => ({
  commentModerationActions: (filter: CommentModerationActionFilter) =>
    retrieveCommentModerationActions(ctx.mongo, ctx.tenant.id, filter),
  commentModerationActionsConnection: (
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
});
