import TenantContext from "coral-server/graph/tenant/context";
import { approve, reject } from "coral-server/services/comments/moderation";
import {
  GQLApproveCommentInput,
  GQLRejectCommentInput,
} from "../schema/__generated__/types";

export const Actions = (ctx: TenantContext) => ({
  approveComment: (input: GQLApproveCommentInput) =>
    approve(ctx.mongo, ctx.redis, ctx.tenant, {
      commentID: input.commentID,
      commentRevisionID: input.commentRevisionID,
      moderatorID: ctx.user!.id,
    }),
  rejectComment: (input: GQLRejectCommentInput) =>
    reject(ctx.mongo, ctx.redis, ctx.tenant, {
      commentID: input.commentID,
      commentRevisionID: input.commentRevisionID,
      moderatorID: ctx.user!.id,
    }),
});
