import TenantContext from "talk-server/graph/tenant/context";
import { accept, reject } from "talk-server/services/comments/moderation";
import {
  GQLAcceptCommentInput,
  GQLRejectCommentInput,
} from "../schema/__generated__/types";

export const Actions = (ctx: TenantContext) => ({
  acceptComment: (input: GQLAcceptCommentInput) =>
    accept(ctx.mongo, ctx.tenant, {
      commentID: input.commentID,
      commentRevisionID: input.commentRevisionID,
      moderatorID: ctx.user!.id,
    }),
  rejectComment: (input: GQLRejectCommentInput) =>
    reject(ctx.mongo, ctx.tenant, {
      commentID: input.commentID,
      commentRevisionID: input.commentRevisionID,
      moderatorID: ctx.user!.id,
    }),
});
