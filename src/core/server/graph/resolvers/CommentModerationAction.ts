import * as actions from "coral-server/models/action/moderation/comment";

import { GQLCommentModerationActionResolvers } from "../schema/__generated__/types";
import { maybeLoadOnlyID } from "./Comment";

import GraphContext from "../context";

export const CommentModerationAction: GQLCommentModerationActionResolvers<
  GraphContext,
  actions.CommentModerationAction
> = {
  revision: async (action, input, ctx) => {
    const comment = await ctx.loaders.Comments.visible.load(action.commentID);
    if (!comment) {
      return null;
    }

    const revision = comment.revisions.find(
      ({ id }) => id === action.commentRevisionID
    );
    if (!revision) {
      return null;
    }

    return { comment, revision };
  },
  comment: ({ commentID, storyID }, args, ctx, info) =>
    maybeLoadOnlyID(ctx, info, storyID, commentID),
  moderator: (action, input, ctx) =>
    action.moderatorID ? ctx.loaders.Users.user.load(action.moderatorID) : null,
};
