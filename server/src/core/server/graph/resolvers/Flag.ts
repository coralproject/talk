import * as actions from "coral-server/models/action/comment";

import {
  GQLCOMMENT_FLAG_REASON,
  GQLFlagTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

import { WrappedCommentRevision } from "./CommentRevision";

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
  revision: async ({ commentID, commentRevisionID }, args, ctx) => {
    const comment = await ctx.loaders.Comments.comment.load(commentID);
    if (!comment) {
      return null;
    }

    const revision = comment.revisions.find((r) => r.id === commentRevisionID);
    if (!revision) {
      return null;
    }

    // Returning a wrapped revision because this is the format
    // that the `CommentRevision.ts` resolver definition is
    // going to expect.
    const wrappedRevision: WrappedCommentRevision = { revision, comment };
    return wrappedRevision;
  },
  comment: ({ commentID }, args, ctx) =>
    ctx.loaders.Comments.comment.load(commentID),
};
