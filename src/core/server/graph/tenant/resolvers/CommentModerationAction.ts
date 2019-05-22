import * as actions from "coral-server/models/action/moderation/comment";

import { GQLCommentModerationActionTypeResolver } from "../schema/__generated__/types";

export const CommentModerationAction: GQLCommentModerationActionTypeResolver<
  actions.CommentModerationAction
> = {
  revision: async (action, input, ctx) => {
    const comment = await ctx.loaders.Comments.comment.load(action.commentID);
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
  moderator: (action, input, ctx) =>
    action.moderatorID ? ctx.loaders.Users.user.load(action.moderatorID) : null,
};
