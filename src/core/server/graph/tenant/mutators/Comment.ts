import TenantContext from "talk-server/graph/tenant/context";
import {
  GQLCreateCommentDontAgreeInput,
  GQLCreateCommentFlagInput,
  GQLCreateCommentInput,
  GQLCreateCommentReactionInput,
  GQLCreateCommentReplyInput,
  GQLEditCommentInput,
  GQLRemoveCommentDontAgreeInput,
  GQLRemoveCommentReactionInput,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { create, edit } from "talk-server/services/comments";
import {
  createDontAgree,
  createFlag,
  createReaction,
  removeDontAgree,
  removeReaction,
} from "talk-server/services/comments/actions";
import { validateMaximumLength } from "./util";

/**
 * MAX_ADDITIONAL_DETAILS_LENGTH defines the maximum length for the
 * additionalDetails field.
 */
const MAX_ADDITIONAL_DETAILS_LENGTH = 500;

export const Comment = (ctx: TenantContext) => ({
  create: ({
    clientMutationId,
    ...comment
  }: GQLCreateCommentInput | GQLCreateCommentReplyInput) =>
    create(
      ctx.mongo,
      ctx.redis,
      ctx.tenant,
      ctx.user!,
      { authorID: ctx.user!.id, ...comment },
      ctx.req
    ),
  edit: ({ commentID, body }: GQLEditCommentInput) =>
    edit(
      ctx.mongo,
      ctx.redis,
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
    createReaction(ctx.mongo, ctx.redis, ctx.tenant, ctx.user!, {
      commentID,
      commentRevisionID,
    }),
  removeReaction: ({ commentID }: GQLRemoveCommentReactionInput) =>
    removeReaction(ctx.mongo, ctx.redis, ctx.tenant, ctx.user!, {
      commentID,
    }),
  createDontAgree: ({
    commentID,
    commentRevisionID,
    additionalDetails,
  }: GQLCreateCommentDontAgreeInput) =>
    createDontAgree(ctx.mongo, ctx.redis, ctx.tenant, ctx.user!, {
      commentID,
      commentRevisionID,
      // TODO: (wyattjoh) move this validation to the schema when bug is fixed: https://github.com/apollographql/graphql-tools/issues/842
      additionalDetails: validateMaximumLength(
        MAX_ADDITIONAL_DETAILS_LENGTH,
        additionalDetails
      ),
    }),
  removeDontAgree: ({ commentID }: GQLRemoveCommentDontAgreeInput) =>
    removeDontAgree(ctx.mongo, ctx.redis, ctx.tenant, ctx.user!, {
      commentID,
    }),
  createFlag: ({
    commentID,
    commentRevisionID,
    reason,
    additionalDetails,
  }: GQLCreateCommentFlagInput) =>
    createFlag(ctx.mongo, ctx.redis, ctx.tenant, ctx.user!, {
      commentID,
      commentRevisionID,
      reason,
      // TODO: (wyattjoh) move this validation to the schema when bug is fixed: https://github.com/apollographql/graphql-tools/issues/842
      additionalDetails: validateMaximumLength(
        MAX_ADDITIONAL_DETAILS_LENGTH,
        additionalDetails
      ),
    }),
});
