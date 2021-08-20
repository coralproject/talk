import GraphContext from "coral-server/graph/context";
import { hasFeatureFlag } from "coral-server/models/tenant";
import { approveComment, rejectComment } from "coral-server/stacks";
import reviewCommentAction from "coral-server/stacks/reviewCommentAction";

import {
  GQLApproveCommentInput,
  GQLFEATURE_FLAG,
  GQLRejectCommentInput,
  GQLReviewCommentFlagInput,
} from "../schema/__generated__/types";

import { validateUserModerationScopes } from "./helpers";

export const Actions = (ctx: GraphContext) => ({
  approveComment: async (input: GQLApproveCommentInput) => {
    // Validate that this user is allowed to moderate this comment if the
    // feature flag is enabled.
    if (hasFeatureFlag(ctx.tenant, GQLFEATURE_FLAG.SITE_MODERATOR)) {
      await validateUserModerationScopes(ctx, ctx.user!, input);
    }

    return approveComment(
      ctx.mongo.live,
      ctx.redis,
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
    // Validate that this user is allowed to moderate this comment if the
    // feature flag is enabled.
    if (hasFeatureFlag(ctx.tenant, GQLFEATURE_FLAG.SITE_MODERATOR)) {
      await validateUserModerationScopes(ctx, ctx.user!, input);
    }

    return rejectComment(
      ctx.mongo.live,
      ctx.redis,
      ctx.broker,
      ctx.tenant,
      input.commentID,
      input.commentRevisionID,
      ctx.user!.id,
      ctx.now
    );
  },
  reviewCommentFlag: async (input: GQLReviewCommentFlagInput) => {
    return await reviewCommentAction(
      ctx.mongo.live,
      ctx.tenant,
      // User must be available here, auth directive requires admin/mod
      ctx.user!,
      ctx.now,
      input.id
    );
  },
});
