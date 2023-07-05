import { defaultTo } from "lodash";

import GraphContext from "coral-server/graph/context";
import { retrieveCommentModerationActionConnection } from "coral-server/models/action/moderation/comment";

import {
  CommentToStatusHistoryArgs,
  UserToCommentModerationActionHistoryArgs,
} from "coral-server/graph/schema/__generated__/types";

export default (ctx: GraphContext) => ({
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
