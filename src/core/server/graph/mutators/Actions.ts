import { CommentNotFoundError } from "coral-server/errors";
import GraphContext from "coral-server/graph/context";
import { approveComment, rejectComment } from "coral-server/stacks";
import reviewCommentAction from "coral-server/stacks/reviewCommentAction";

import {
  GQLApproveCommentInput,
  GQLRejectCommentInput,
  GQLReviewCommentFlagInput,
} from "../schema/__generated__/types";

import { validateUserModerationScopes } from "./helpers";

export const Actions = (ctx: GraphContext) => ({
  approveComment: async (input: GQLApproveCommentInput) => {
    // Validate that this user is allowed to moderate this comment
    await validateUserModerationScopes(ctx, ctx.user!, input);

    return approveComment(
      ctx.mongo,
      ctx.redis,
      ctx.cache,
      ctx.broker,
      ctx.tenant,
      input.commentID,
      input.commentRevisionID,
      ctx.user!.id,
      ctx.now,
      ctx.req
    );
  },
  rejectComment: async (input: GQLRejectCommentInput) => {
    // Validate that this user is allowed to moderate this comment
    await validateUserModerationScopes(ctx, ctx.user!, input);

    const comment = await ctx.loaders.Comments.comment.load(input.commentID);
    if (!comment) {
      throw new CommentNotFoundError(input.commentID);
    }

    return rejectComment(
      ctx.mongo,
      ctx.redis,
      ctx.cache,
      ctx.broker,
      ctx.tenant,
      comment,
      input.commentRevisionID,
      ctx.user!.id,
      ctx.now
    );
  },
  reviewCommentFlag: async (input: GQLReviewCommentFlagInput) => {
    return await reviewCommentAction(
      ctx.mongo,
      ctx.tenant,
      // User must be available here, auth directive requires admin/mod
      ctx.user!,
      ctx.now,
      input.id
    );
  },
});
