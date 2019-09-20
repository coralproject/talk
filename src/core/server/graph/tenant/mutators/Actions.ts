import TenantContext from "coral-server/graph/tenant/context";
import { hasTag } from "coral-server/models/comment";
import { removeTag } from "coral-server/services/comments";
import { approve, reject } from "coral-server/services/comments/moderation";
import {
  GQLApproveCommentInput,
  GQLRejectCommentInput,
  GQLTAG,
} from "../schema/__generated__/types";

export const Actions = (ctx: TenantContext) => ({
  approveComment: (input: GQLApproveCommentInput) =>
    approve(ctx.mongo, ctx.redis, ctx.publisher, ctx.tenant, {
      commentID: input.commentID,
      commentRevisionID: input.commentRevisionID,
      moderatorID: ctx.user!.id,
    }),
  rejectComment: (input: GQLRejectCommentInput) =>
    reject(ctx.mongo, ctx.redis, ctx.publisher, ctx.tenant, {
      commentID: input.commentID,
      commentRevisionID: input.commentRevisionID,
      moderatorID: ctx.user!.id,
    }).then(comment =>
      // if a comment was previously featured
      // and is now rejected, we need to remove the
      // featured tag
      hasTag(comment, GQLTAG.FEATURED)
        ? removeTag(ctx.mongo, ctx.tenant, comment.id, GQLTAG.FEATURED)
        : comment
    ),
});
