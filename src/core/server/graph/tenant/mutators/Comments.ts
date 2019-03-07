import { ERROR_CODES } from "talk-common/errors";
import { ADDITIONAL_DETAILS_MAX_LENGTH } from "talk-common/helpers/validate";
import { mapFieldsetToErrorCodes } from "talk-server/graph/common/errors";
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

export const Comments = (ctx: TenantContext) => ({
  create: ({
    clientMutationId,
    ...comment
  }: GQLCreateCommentInput | GQLCreateCommentReplyInput) =>
    mapFieldsetToErrorCodes(
      create(
        ctx.mongo,
        ctx.redis,
        ctx.indexerQueue,
        ctx.tenant,
        ctx.user!,
        { authorID: ctx.user!.id, ...comment },
        ctx.req
      ),
      {
        "input.body": [
          ERROR_CODES.COMMENT_BODY_EXCEEDS_MAX_LENGTH,
          ERROR_CODES.COMMENT_BODY_TOO_SHORT,
        ],
      }
    ),
  edit: ({ commentID, body }: GQLEditCommentInput) =>
    mapFieldsetToErrorCodes(
      edit(
        ctx.mongo,
        ctx.redis,
        ctx.indexerQueue,
        ctx.tenant,
        ctx.user!,
        {
          id: commentID,
          body,
        },
        ctx.req
      ),
      {
        "input.body": [
          ERROR_CODES.COMMENT_BODY_EXCEEDS_MAX_LENGTH,
          ERROR_CODES.COMMENT_BODY_TOO_SHORT,
        ],
      }
    ),
  createReaction: ({
    commentID,
    commentRevisionID,
  }: GQLCreateCommentReactionInput) =>
    createReaction(
      ctx.mongo,
      ctx.redis,
      ctx.indexerQueue,
      ctx.tenant,
      ctx.user!,
      {
        commentID,
        commentRevisionID,
      }
    ),
  removeReaction: ({ commentID }: GQLRemoveCommentReactionInput) =>
    removeReaction(
      ctx.mongo,
      ctx.redis,
      ctx.indexerQueue,
      ctx.tenant,
      ctx.user!,
      {
        commentID,
      }
    ),
  createDontAgree: ({
    commentID,
    commentRevisionID,
    additionalDetails,
  }: GQLCreateCommentDontAgreeInput) =>
    createDontAgree(
      ctx.mongo,
      ctx.redis,
      ctx.indexerQueue,
      ctx.tenant,
      ctx.user!,
      {
        commentID,
        commentRevisionID,
        // TODO: (wyattjoh) move this validation to the schema when bug is fixed: https://github.com/apollographql/graphql-tools/issues/842
        additionalDetails: validateMaximumLength(
          ADDITIONAL_DETAILS_MAX_LENGTH,
          additionalDetails
        ),
      }
    ),
  removeDontAgree: ({ commentID }: GQLRemoveCommentDontAgreeInput) =>
    removeDontAgree(
      ctx.mongo,
      ctx.redis,
      ctx.indexerQueue,
      ctx.tenant,
      ctx.user!,
      {
        commentID,
      }
    ),
  createFlag: ({
    commentID,
    commentRevisionID,
    reason,
    additionalDetails,
  }: GQLCreateCommentFlagInput) =>
    createFlag(ctx.mongo, ctx.redis, ctx.indexerQueue, ctx.tenant, ctx.user!, {
      commentID,
      commentRevisionID,
      reason,
      // TODO: (wyattjoh) move this validation to the schema when bug is fixed: https://github.com/apollographql/graphql-tools/issues/842
      additionalDetails: validateMaximumLength(
        ADDITIONAL_DETAILS_MAX_LENGTH,
        additionalDetails
      ),
    }),
});
