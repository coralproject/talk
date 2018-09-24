import TenantContext from "talk-server/graph/tenant/context";
import {
  GQLCreateCommentInput,
  GQLCreateCommentReactionInput,
  GQLDeleteCommentReactionInput,
  GQLEditCommentInput,
} from "talk-server/graph/tenant/schema/__generated__/types";
import {
  create,
  createReaction,
  deleteReaction,
  edit,
} from "talk-server/services/comments";

export default (ctx: TenantContext) => ({
  create: (input: GQLCreateCommentInput) =>
    create(
      ctx.mongo,
      ctx.tenant,
      ctx.user!,
      {
        author_id: ctx.user!.id,
        asset_id: input.assetID,
        body: input.body,
        parent_id: input.parentID,
      },
      ctx.req
    ),
  edit: (input: GQLEditCommentInput) =>
    edit(
      ctx.mongo,
      ctx.tenant,
      ctx.user!,
      {
        id: input.commentID,
        body: input.body,
      },
      ctx.req
    ),
  createReaction: (input: GQLCreateCommentReactionInput) =>
    createReaction(ctx.mongo, ctx.tenant, ctx.user!, {
      item_id: input.commentID,
    }),
  deleteReaction: (input: GQLDeleteCommentReactionInput) =>
    deleteReaction(ctx.mongo, ctx.tenant, ctx.user!, {
      item_id: input.commentID,
    }),
});
