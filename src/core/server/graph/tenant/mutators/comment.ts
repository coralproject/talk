import TenantContext from "talk-server/graph/tenant/context";
import {
  GQLCreateCommentDontAgreeInput,
  GQLCreateCommentFlagInput,
  GQLCreateCommentInput,
  GQLCreateCommentReactionInput,
  GQLDeleteCommentDontAgreeInput,
  GQLDeleteCommentFlagInput,
  GQLDeleteCommentReactionInput,
  GQLEditCommentInput,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { create, edit } from "talk-server/services/comments";
import {
  createDontAgree,
  createFlag,
  createReaction,
  deleteDontAgree,
  deleteFlag,
  deleteReaction,
} from "talk-server/services/comments/actions";

export default (ctx: TenantContext) => ({
  create: (input: GQLCreateCommentInput) =>
    create(
      ctx.mongo,
      ctx.tenant,
      ctx.user!,
      {
        author_id: ctx.user!.id,
        story_id: input.storyID,
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
  createDontAgree: (input: GQLCreateCommentDontAgreeInput) =>
    createDontAgree(ctx.mongo, ctx.tenant, ctx.user!, {
      item_id: input.commentID,
    }),
  deleteDontAgree: (input: GQLDeleteCommentDontAgreeInput) =>
    deleteDontAgree(ctx.mongo, ctx.tenant, ctx.user!, {
      item_id: input.commentID,
    }),
  createFlag: (input: GQLCreateCommentFlagInput) =>
    createFlag(ctx.mongo, ctx.tenant, ctx.user!, {
      item_id: input.commentID,
      reason: input.reason,
    }),
  deleteFlag: (input: GQLDeleteCommentFlagInput) =>
    deleteFlag(ctx.mongo, ctx.tenant, ctx.user!, {
      item_id: input.commentID,
    }),
});
