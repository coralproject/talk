import TenantContext from "talk-server/graph/tenant/context";
import {
  GQLCreateCommentDontAgreeInput,
  GQLCreateCommentFlagInput,
  GQLCreateCommentInput,
  GQLCreateCommentReactionInput,
  GQLEditCommentInput,
  GQLRemoveCommentDontAgreeInput,
  GQLRemoveCommentFlagInput,
  GQLRemoveCommentReactionInput,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { create, edit } from "talk-server/services/comments";
import {
  createDontAgree,
  createFlag,
  createReaction,
  removeDontAgree,
  removeFlag,
  removeReaction,
} from "talk-server/services/comments/actions";

export const Comment = (ctx: TenantContext) => ({
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
  removeReaction: (input: GQLRemoveCommentReactionInput) =>
    removeReaction(ctx.mongo, ctx.tenant, ctx.user!, {
      item_id: input.commentID,
    }),
  createDontAgree: (input: GQLCreateCommentDontAgreeInput) =>
    createDontAgree(ctx.mongo, ctx.tenant, ctx.user!, {
      item_id: input.commentID,
    }),
  removeDontAgree: (input: GQLRemoveCommentDontAgreeInput) =>
    removeDontAgree(ctx.mongo, ctx.tenant, ctx.user!, {
      item_id: input.commentID,
    }),
  createFlag: (input: GQLCreateCommentFlagInput) =>
    createFlag(ctx.mongo, ctx.tenant, ctx.user!, {
      item_id: input.commentID,
      reason: input.reason,
    }),
  removeFlag: (input: GQLRemoveCommentFlagInput) =>
    removeFlag(ctx.mongo, ctx.tenant, ctx.user!, {
      item_id: input.commentID,
    }),
});
