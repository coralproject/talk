import GraphContext from "coral-server/graph/context";
import { approveComment, rejectComment } from "coral-server/stacks";
import reviewCommentAction from "coral-server/stacks/reviewCommentAction";

import {
  GQLApproveCommentInput,
  GQLRejectCommentInput,
  GQLReviewCommentFlagInput,
} from "../schema/__generated__/types";

import { CommentNotFoundError, StoryNotFoundError } from "coral-server/errors";
import { validateUserModerationScopes } from "./helpers";

export const Actions = (ctx: GraphContext) => ({
  approveComment: async (input: GQLApproveCommentInput) => {
    // Validate that this user is allowed to moderate this comment
    await validateUserModerationScopes(ctx, ctx.user!, input);

    return approveComment(
      ctx.mongo,
      ctx.redis,
      ctx.cache,
      ctx.config,
      ctx.i18n,
      ctx.broker,
      ctx.notifications,
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

    const story = await ctx.loaders.Stories.find.load({ id: comment.storyID });
    if (!story) {
      throw new StoryNotFoundError(comment.storyID);
    }

    return rejectComment(
      ctx.mongo,
      ctx.redis,
      ctx.cache,
      ctx.config,
      ctx.i18n,
      ctx.broker,
      ctx.notifications,
      ctx.tenant,
      input.commentID,
      input.commentRevisionID,
      ctx.user!.id,
      ctx.now,
      input.reason,
      undefined,
      ctx.req,
      true,
      story.isArchived || story.isArchiving
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
