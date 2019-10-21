import { defaultTo } from "lodash";

import TenantContext from "coral-server/graph/tenant/context";
import {
  CommentToStatusHistoryArgs,
  UserToCommentModerationActionHistoryArgs,
} from "coral-server/graph/tenant/schema/__generated__/types";
import { retrieveCommentModerationActionConnection } from "coral-server/models/action/moderation/comment";

export default (ctx: TenantContext) => ({
  forModerator: (
    { first, after }: UserToCommentModerationActionHistoryArgs,
    moderatorID: string
  ) =>
    retrieveCommentModerationActionConnection(ctx.mongo, ctx.tenant.id, {
      first: defaultTo(first, 10),
      after,
      filter: {
        moderatorID,
      },
    }),
  forComment: (
    { first, after }: CommentToStatusHistoryArgs,
    commentID: string
  ) =>
    retrieveCommentModerationActionConnection(ctx.mongo, ctx.tenant.id, {
      first: defaultTo(first, 10),
      after,
      filter: {
        commentID,
      },
    }),
});
