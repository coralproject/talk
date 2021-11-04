import { ERROR_CODES } from "coral-common/errors";
import { ADDITIONAL_DETAILS_MAX_LENGTH } from "coral-common/helpers/validate";
import GraphContext from "coral-server/graph/context";
import { mapFieldsetToErrorCodes } from "coral-server/graph/errors";
import { addTag, removeTag } from "coral-server/services/comments";
import {
  createDontAgree,
  createFlag,
  createReaction,
  removeDontAgree,
  removeReaction,
} from "coral-server/services/comments/actions";
import { CreateCommentMediaInput } from "coral-server/services/comments/media";
import { publishCommentFeatured } from "coral-server/services/events";
import {
  approveComment,
  createComment,
  editComment,
} from "coral-server/stacks";

import {
  GQLCOMMENT_STATUS,
  GQLCreateCommentDontAgreeInput,
  GQLCreateCommentFlagInput,
  GQLCreateCommentInput,
  GQLCreateCommentReactionInput,
  GQLCreateCommentReplyInput,
  GQLEditCommentInput,
  GQLFeatureCommentInput,
  GQLRemoveCommentDontAgreeInput,
  GQLRemoveCommentReactionInput,
  GQLTAG,
  GQLUnfeatureCommentInput,
} from "coral-server/graph/schema/__generated__/types";

import { validateUserModerationScopes } from "./helpers";
import { validateMaximumLength, WithoutMutationID } from "./util";

export const Comments = (ctx: GraphContext) => ({
  create: ({
    clientMutationId,
    nudge = false,
    media,
    ...comment
  }: GQLCreateCommentInput | GQLCreateCommentReplyInput) =>
    mapFieldsetToErrorCodes(
      createComment(
        ctx.mongo,
        ctx.redis,
        ctx.config,
        ctx.broker,
        ctx.tenant,
        ctx.user!,
        {
          ...comment,
          authorID: ctx.user!.id,
          // TODO: (wyattjoh) check this type to get it to match.
          media: media as CreateCommentMediaInput,
        },
        nudge,
        ctx.now,
        ctx.req
      ),
      {
        "input.body": [
          ERROR_CODES.COMMENT_BODY_EXCEEDS_MAX_LENGTH,
          ERROR_CODES.COMMENT_BODY_TOO_SHORT,
        ],
        "input.parentID": [ERROR_CODES.COMMENT_NOT_FOUND],
        "input.storyID": [ERROR_CODES.STORY_NOT_FOUND],
      }
    ),
  edit: ({ commentID, body, media }: GQLEditCommentInput) =>
    mapFieldsetToErrorCodes(
      editComment(
        ctx.mongo,
        ctx.redis,
        ctx.config,
        ctx.broker,
        ctx.tenant,
        ctx.user!,
        {
          id: commentID,
          body,
          // TODO: (wyattjoh) check this type to get it to match.
          media: media as CreateCommentMediaInput,
        },
        ctx.now,
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
      ctx.broker,
      ctx.tenant,
      ctx.user!,
      {
        commentID,
        commentRevisionID,
      },
      ctx.now
    ),
  removeReaction: ({ commentID }: GQLRemoveCommentReactionInput) =>
    removeReaction(ctx.mongo, ctx.redis, ctx.broker, ctx.tenant, ctx.user!, {
      commentID,
    }),
  createDontAgree: ({
    commentID,
    commentRevisionID,
    additionalDetails,
  }: GQLCreateCommentDontAgreeInput) =>
    createDontAgree(
      ctx.mongo,
      ctx.redis,
      ctx.broker,
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
      },
      ctx.now
    ),
  removeDontAgree: ({ commentID }: GQLRemoveCommentDontAgreeInput) =>
    removeDontAgree(ctx.mongo, ctx.redis, ctx.broker, ctx.tenant, ctx.user!, {
      commentID,
    }),
  createFlag: ({
    commentID,
    commentRevisionID,
    reason,
    additionalDetails,
  }: GQLCreateCommentFlagInput) =>
    createFlag(
      ctx.mongo,
      ctx.redis,
      ctx.broker,
      ctx.tenant,
      ctx.user!,
      {
        commentID,
        commentRevisionID,
        reason,
        // TODO: (wyattjoh) move this validation to the schema when bug is fixed: https://github.com/apollographql/graphql-tools/issues/842
        additionalDetails: validateMaximumLength(
          ADDITIONAL_DETAILS_MAX_LENGTH,
          additionalDetails
        ),
      },
      ctx.now,
      ctx.req
    ),
  feature: async ({
    commentID,
    commentRevisionID,
  }: WithoutMutationID<GQLFeatureCommentInput>) => {
    await validateUserModerationScopes(ctx, ctx.user!, { commentID });

    const comment = await addTag(
      ctx.mongo,
      ctx.tenant,
      commentID,
      commentRevisionID,
      ctx.user!,
      GQLTAG.FEATURED,
      ctx.now
    );

    if (comment.status !== GQLCOMMENT_STATUS.APPROVED) {
      await approveComment(
        ctx.mongo,
        ctx.redis,
        ctx.broker,
        ctx.tenant,
        commentID,
        commentRevisionID,
        ctx.user!.id,
        ctx.now
      );
    }

    // Publish that the comment was featured.
    await publishCommentFeatured(ctx.broker, comment);

    // Return it to the next step.
    return comment;
  },
  unfeature: async ({
    commentID,
  }: WithoutMutationID<GQLUnfeatureCommentInput>) => {
    await validateUserModerationScopes(ctx, ctx.user!, { commentID });

    return removeTag(ctx.mongo, ctx.tenant, commentID, GQLTAG.FEATURED);
  },
});
