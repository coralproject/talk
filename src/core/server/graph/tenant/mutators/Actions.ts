import TenantContext from "coral-server/graph/tenant/context";
import stacks from "coral-server/stacks";

import {
  GQLApproveCommentInput,
  GQLRejectCommentInput,
} from "../schema/__generated__/types";

export const Actions = (ctx: TenantContext) => ({
  approveComment: (input: GQLApproveCommentInput) =>
    stacks.approveComment(
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
    stacks.rejectComment(
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
