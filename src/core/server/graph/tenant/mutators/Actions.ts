import TenantContext from "coral-server/graph/tenant/context";
import slices from "coral-server/services/comments/moderation/slices";
import {
  GQLApproveCommentInput,
  GQLRejectCommentInput,
} from "../schema/__generated__/types";

export const Actions = (ctx: TenantContext) => ({
  approveComment: (input: GQLApproveCommentInput) =>
    slices.approve(
      ctx.mongo,
      ctx.redis,
      ctx.publisher,
      ctx.tenant,
      input.commentID,
      input.commentRevisionID,
      ctx.user!.id,
      ctx.now
    ),
  rejectComment: (input: GQLRejectCommentInput) =>
    slices.reject(
      ctx.mongo,
      ctx.redis,
      ctx.publisher,
      ctx.tenant,
      input.commentID,
      input.commentRevisionID,
      ctx.user!.id,
      ctx.now
    ),
});
