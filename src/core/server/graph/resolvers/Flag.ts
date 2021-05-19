import * as actions from "coral-server/models/action/comment";

import {
  GQLCOMMENT_FLAG_REASON,
  GQLFlagTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const Flag: GQLFlagTypeResolver<actions.CommentAction> = {
  reason: ({ id, reason }, args, ctx) => {
    if (reason && reason in GQLCOMMENT_FLAG_REASON) {
      return reason;
    }

    ctx.logger.warn(
      { actionID: id, flagReason: reason },
      "found an invalid reason"
    );

    return null;
  },
  flagger: ({ userID }, args, ctx) => {
    if (userID) {
      return ctx.loaders.Users.user.load(userID);
    }

    return null;
  },
  reviewed: ({ reviewed = false }) => reviewed,
  comment: ({ commentID }, args, ctx) =>
    ctx.loaders.Comments.comment.load(commentID),
};
