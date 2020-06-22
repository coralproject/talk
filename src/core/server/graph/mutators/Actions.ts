import GraphContext from "coral-server/graph/context";
import { approveComment, rejectComment } from "coral-server/stacks";

import {
  GQLApproveCommentInput,
  GQLRejectCommentInput,
} from "../schema/__generated__/types";
import { validateUserModerationScopes } from "./helpers";

export const Actions = (ctx: GraphContext) => ({
  approveComment: async (input: GQLApproveCommentInput) => {
    // Validate that this user is allowed to moderate this comment.
    await validateUserModerationScopes(ctx, ctx.user!, input);

    return approveComment(
      ctx.mongo,
      ctx.redis,
      ctx.broker,
      ctx.tenant,
      input.commentID,
      input.commentRevisionID,
      ctx.user!.id,
      ctx.now
    );
  },
  rejectComment: async (input: GQLRejectCommentInput) => {
    // Validate that this user is allowed to moderate this comment.
    await validateUserModerationScopes(ctx, ctx.user!, input);

    return rejectComment(
      ctx.mongo,
      ctx.redis,
      ctx.broker,
      ctx.tenant,
      input.commentID,
      input.commentRevisionID,
      ctx.user!.id,
      ctx.now
    );
  },
});
