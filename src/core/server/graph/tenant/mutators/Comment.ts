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
  create: ({ storyID, body, parentID }: GQLCreateCommentInput) =>
    create(
      ctx.mongo,
      ctx.tenant,
      ctx.user!,
      { authorID: ctx.user!.id, storyID, body, parentID },
      ctx.req
    ),
  edit: ({ commentID, body }: GQLEditCommentInput) =>
    edit(
      ctx.mongo,
      ctx.tenant,
      ctx.user!,
      {
        id: commentID,
        body,
      },
      ctx.req
    ),
  createReaction: ({
    commentID,
    commentRevisionID,
  }: GQLCreateCommentReactionInput) =>
    createReaction(ctx.mongo, ctx.tenant, ctx.user!, {
      commentID,
      commentRevisionID,
    }),
  removeReaction: ({ commentID }: GQLRemoveCommentReactionInput) =>
    removeReaction(ctx.mongo, ctx.tenant, ctx.user!, {
      commentID,
    }),
  createDontAgree: ({
    commentID,
    commentRevisionID,
  }: GQLCreateCommentDontAgreeInput) =>
    createDontAgree(ctx.mongo, ctx.tenant, ctx.user!, {
      commentID,
      commentRevisionID,
    }),
  removeDontAgree: ({ commentID }: GQLRemoveCommentDontAgreeInput) =>
    removeDontAgree(ctx.mongo, ctx.tenant, ctx.user!, {
      commentID,
    }),
  createFlag: ({
    commentID,
    commentRevisionID,
    reason,
  }: GQLCreateCommentFlagInput) =>
    createFlag(ctx.mongo, ctx.tenant, ctx.user!, {
      commentID,
      commentRevisionID,
      reason,
    }),
  removeFlag: ({ commentID }: GQLRemoveCommentFlagInput) =>
    removeFlag(ctx.mongo, ctx.tenant, ctx.user!, {
      commentID,
    }),
});
