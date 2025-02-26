import { ERROR_CODES } from "coral-common/common/lib/errors";
import { ADDITIONAL_DETAILS_MAX_LENGTH } from "coral-common/common/lib/helpers/validate";
import GraphContext from "coral-server/graph/context";
import { mapFieldsetToErrorCodes } from "coral-server/graph/errors";
import {
  hasTag,
  retrieveLatestFeaturedCommentForAuthor,
} from "coral-server/models/comment";
import { updateLastFeaturedDate } from "coral-server/models/user";
import { addTag, removeTag } from "coral-server/services/comments";
import {
  createDontAgree,
  createFlag,
  createIllegalContent,
  createReaction,
  removeDontAgree,
  removeReaction,
} from "coral-server/services/comments/actions";
import { CreateCommentMediaInput } from "coral-server/services/comments/media";
import { publishCommentFeatured } from "coral-server/services/events";
import { markSeen } from "coral-server/services/seenComments";
import {
  approveComment,
  createComment,
  editComment,
} from "coral-server/stacks";
import { updateTagCommentCounts } from "coral-server/stacks/helpers/updateAllCommentCounts";

import {
  GQLCOMMENT_STATUS,
  GQLCreateCommentDontAgreeInput,
  GQLCreateCommentFlagInput,
  GQLCreateCommentInput,
  GQLCreateCommentReactionInput,
  GQLCreateCommentReplyInput,
  GQLCreateIllegalContentInput,
  GQLEditCommentInput,
  GQLFeatureCommentInput,
  GQLMarkCommentsAsSeenInput,
  GQLNOTIFICATION_TYPE,
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
        ctx.wordList,
        ctx.cache,
        ctx.config,
        ctx.i18n,
        ctx.broker,
        ctx.notifications,
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
        ctx.wordList,
        ctx.cache,
        ctx.config,
        ctx.i18n,
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
      ctx.config,
      ctx.i18n,
      ctx.cache,
      ctx.broker,
      ctx.tenant,
      ctx.user!,
      {
        commentID,
        commentRevisionID,
      },
      ctx.now
    ),
  removeReaction: ({
    commentID,
    commentRevisionID,
  }: GQLRemoveCommentReactionInput) =>
    removeReaction(
      ctx.mongo,
      ctx.redis,
      ctx.config,
      ctx.i18n,
      ctx.cache,
      ctx.broker,
      ctx.tenant,
      ctx.user!,
      {
        commentID,
        commentRevisionID,
      }
    ),
  createIllegalContent: async ({
    commentID,
    commentRevisionID,
  }: GQLCreateIllegalContentInput) =>
    createIllegalContent(
      ctx.mongo,
      ctx.redis,
      ctx.config,
      ctx.i18n,
      ctx.cache.commentActions,
      ctx.broker,
      ctx.tenant,
      ctx.user!,
      await ctx.loaders.Comments.comment.load(commentID),
      {
        commentID,
        commentRevisionID,
      },
      ctx.now
    ),
  createDontAgree: ({
    commentID,
    commentRevisionID,
    additionalDetails,
  }: GQLCreateCommentDontAgreeInput) =>
    createDontAgree(
      ctx.mongo,
      ctx.redis,
      ctx.config,
      ctx.i18n,
      ctx.cache.commentActions,
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
  removeDontAgree: ({
    commentID,
    commentRevisionID,
  }: GQLRemoveCommentDontAgreeInput) =>
    removeDontAgree(
      ctx.mongo,
      ctx.redis,
      ctx.config,
      ctx.i18n,
      ctx.cache,
      ctx.broker,
      ctx.tenant,
      ctx.user!,
      {
        commentID,
        commentRevisionID,
      }
    ),
  createFlag: ({
    commentID,
    commentRevisionID,
    reason,
    additionalDetails,
  }: GQLCreateCommentFlagInput) =>
    createFlag(
      ctx.mongo,
      ctx.redis,
      ctx.config,
      ctx.i18n,
      ctx.cache.commentActions,
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
    // Validate that this user is allowed to moderate this comment
    await validateUserModerationScopes(ctx, ctx.user!, { commentID });

    const { comment, alreadyFeatured } = await addTag(
      ctx.mongo,
      ctx.tenant,
      commentID,
      commentRevisionID,
      ctx.user!,
      GQLTAG.FEATURED,
      ctx.now
    );

    // The comment is already featured; we don't need to feature again
    if (alreadyFeatured) {
      return comment;
    }

    if (comment.status !== GQLCOMMENT_STATUS.APPROVED) {
      await approveComment(
        ctx.mongo,
        ctx.redis,
        ctx.cache,
        ctx.config,
        ctx.i18n,
        ctx.broker,
        ctx.notifications,
        ctx.tenant,
        commentID,
        commentRevisionID,
        ctx.user!.id,
        ctx.now,
        undefined,
        false
      );
    }

    await updateTagCommentCounts(
      ctx.tenant.id,
      comment.storyID,
      comment.siteID!,
      ctx.mongo,
      ctx.redis,
      // Create a diff where "before" tags does not have a
      // featured tag and the after does since the previous
      // `addTag` put the featured tag onto the comment
      comment.tags.filter((t) => t.type !== GQLTAG.FEATURED),
      comment.tags
    );

    // Publish that the comment was featured.
    await publishCommentFeatured(ctx.broker, comment);

    // If the Top commenter feature is enabled, we need to update lastFeaturedDate
    if (ctx.tenant?.topCommenter) {
      const updatedUser = await updateLastFeaturedDate(
        ctx.mongo,
        ctx.tenant.id,
        comment.authorID!
      );
      const cacheAvailable = await ctx.cache.available(ctx.tenant.id);
      if (cacheAvailable) {
        await ctx.cache.users.update(updatedUser);
      }
    }

    await ctx.notifications.create(ctx.tenant.id, ctx.tenant.locale, {
      targetUserID: comment.authorID!,
      comment,
      type: GQLNOTIFICATION_TYPE.COMMENT_FEATURED,
    });

    // Return it to the next step.
    return comment;
  },
  unfeature: async ({
    commentID,
  }: WithoutMutationID<GQLUnfeatureCommentInput>) => {
    // Validate that this user is allowed to moderate this comment
    await validateUserModerationScopes(ctx, ctx.user!, { commentID });

    const { comment, alreadyUnfeatured } = await removeTag(
      ctx.mongo,
      ctx.tenant,
      commentID,
      GQLTAG.FEATURED
    );

    // The comment is already unfeatured; we don't need to unfeature again
    if (alreadyUnfeatured) {
      return comment;
    }

    // If the tag is sucessfully removed (the tag is
    // no longer present on the comment) then we can
    // update the tag story counts.
    const isFeatured = hasTag(comment, GQLTAG.FEATURED);
    if (!isFeatured) {
      await updateTagCommentCounts(
        ctx.tenant.id,
        comment.storyID,
        comment.siteID!,
        ctx.mongo,
        ctx.redis,
        // Create a diff where "before" has the featured tag,
        // and after does not since the result of the previous
        // `removeTag` took the featured tag off of the comment
        [...comment.tags, { type: GQLTAG.FEATURED, createdAt: new Date() }],
        comment.tags
      );
    }

    // If the Top commenter feature is enabled, we need to update lastFeaturedDate
    if (ctx.tenant?.topCommenter) {
      // get latest featured comment if any
      const latestFeatured = await retrieveLatestFeaturedCommentForAuthor(
        ctx.mongo,
        ctx.tenant.id,
        comment.authorID!
      );

      // if a latest featured comment, update latestFeaturedDate for user to when it was featured
      // otherwise just set to null
      const latestFeaturedDate =
        latestFeatured.length > 0 ? latestFeatured[0].createdAt : null;

      const updatedUser = await updateLastFeaturedDate(
        ctx.mongo,
        ctx.tenant.id,
        comment.authorID!,
        latestFeaturedDate
      );

      const cacheAvailable = await ctx.cache.available(ctx.tenant.id);
      if (cacheAvailable) {
        await ctx.cache.users.update(updatedUser);
      }
    }

    return comment;
  },
  markAsSeen: async ({
    commentIDs,
    storyID,
    markAllAsSeen,
  }: WithoutMutationID<GQLMarkCommentsAsSeenInput>) => {
    if (ctx.user) {
      await markSeen(
        ctx.mongo,
        ctx.cache,
        ctx.tenant.id,
        storyID,
        ctx.user?.id,
        commentIDs,
        ctx.now,
        markAllAsSeen
      );
    }

    const comments =
      (await ctx.loaders.Comments.comment.loadMany(commentIDs)) ?? [];
    return comments;
  },
});
