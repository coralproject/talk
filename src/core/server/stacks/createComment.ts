import Joi from "joi";
import { isNumber } from "lodash";

import { ERROR_TYPES } from "coral-common/errors";
import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import {
  AncestorRejectedError,
  AuthorAlreadyHasRatedStory,
  CannotCreateCommentOnArchivedStory,
  CommentNotFoundError,
  CoralError,
  StoryNotFoundError,
  UserSiteBanned,
} from "coral-server/errors";
import { CoralEventPublisherBroker } from "coral-server/events/publisher";
import logger from "coral-server/logger";
import {
  encodeActionCounts,
  EncodedCommentActionCounts,
  filterDuplicateActions,
} from "coral-server/models/action/comment";
import {
  Comment,
  CommentMedia,
  createComment,
  CreateCommentInput,
  hasAuthorStoryRating,
  pushChildCommentIDOntoParent,
  retrieveManyComments,
} from "coral-server/models/comment";
import { getDepth, hasAncestors } from "coral-server/models/comment/helpers";
import { markSeenComments } from "coral-server/models/seenComments/seenComments";
import { retrieveSite } from "coral-server/models/site";
import {
  isUserStoryExpert,
  resolveStoryMode,
  retrieveStory,
  Story,
  updateStoryLastCommentedAt,
} from "coral-server/models/story";
import { ensureFeatureFlag, Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import { isSiteBanned } from "coral-server/models/user/helpers";
import { removeTag } from "coral-server/services/comments";
import {
  addCommentActions,
  CreateAction,
} from "coral-server/services/comments/actions";
import {
  attachMedia,
  CreateCommentMediaInput,
} from "coral-server/services/comments/media";
import {
  PhaseResult,
  processForModeration,
} from "coral-server/services/comments/pipeline";
import { AugmentedRedis } from "coral-server/services/redis";
import { updateUserLastCommentID } from "coral-server/services/users";
import { Request } from "coral-server/types/express";

import {
  GQLCOMMENT_STATUS,
  GQLFEATURE_FLAG,
  GQLSTORY_MODE,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

import approveComment from "./approveComment";
import {
  publishChanges,
  retrieveParent,
  updateAllCommentCounts,
} from "./helpers";
import { updateTagCommentCounts } from "./helpers/updateAllCommentCounts";

export type CreateComment = Omit<
  CreateCommentInput,
  | "status"
  | "metadata"
  | "ancestorIDs"
  | "actionCounts"
  | "tags"
  | "siteID"
  | "media"
> & {
  rating?: number;
  media?: CreateCommentMediaInput;
};

const markCommentAsAnswered = async (
  mongo: MongoContext,
  redis: AugmentedRedis,
  broker: CoralEventPublisherBroker,
  tenant: Tenant,
  comment: Readonly<Comment>,
  story: Story,
  author: User,
  now: Date
) => {
  // We only process this if we're in Q&A mode.
  if (resolveStoryMode(story.settings, tenant) !== GQLSTORY_MODE.QA) {
    return;
  }

  // Answers are always a reply to another comment.
  // If we have a parentID and a parentRevisionID, then
  // we have a parent, which means we are replying.
  if (!comment.parentID || !comment.parentRevisionID) {
    return;
  }

  // If the author is not an expert, then we can't mark the question as
  // answered!
  if (!isUserStoryExpert(story.settings, author.id)) {
    return;
  }

  // If this comment is deeper than the first reply, or is a top level comment,
  // then we can't mark it as answered!
  if (getDepth(comment) !== 1) {
    return;
  }

  const parent = await retrieveParent(mongo, tenant.id, {
    parentID: comment.parentID,
    parentRevisionID: comment.parentRevisionID,
  });
  if (!parent) {
    throw new CommentNotFoundError(comment.parentID);
  }

  // We need to mark the parent question as answered.
  // - Remove the unanswered tag.
  // - Approve it since an expert has replied to it.
  await Promise.all([
    removeTag(mongo, tenant, comment.parentID, GQLTAG.UNANSWERED),
    approveComment(
      mongo,
      redis,
      broker,
      tenant,
      comment.parentID,
      comment.parentRevisionID,
      author.id,
      now
    ),
  ]);

  await updateTagCommentCounts(
    tenant.id,
    comment.storyID,
    comment.siteID,
    mongo,
    redis,
    // Since we removed the UNANSWERED tag, we need to recreate the
    // before after state of having an UNANSWERED tag followed by
    // not having an unanswered tag
    parent.tags,
    parent.tags.filter((t) => t.type !== GQLTAG.UNANSWERED)
  );
};

const RatingSchema = Joi.number().min(1).max(5).integer();

const validateRating = async (
  mongo: MongoContext,
  tenant: Tenant,
  author: User,
  story: Story,
  rating: number
) => {
  // Ensure Tenant has ratings enabled.
  ensureFeatureFlag(tenant, GQLFEATURE_FLAG.ENABLE_RATINGS_AND_REVIEWS);

  // Check that the rating is within range.
  Joi.assert(rating, RatingSchema, "rating is not within range");

  // Check to see if this user has already submitted a comment with a rating
  // on this story.
  const existing = await hasAuthorStoryRating(
    mongo,
    tenant.id,
    story.id,
    author.id
  );
  if (existing) {
    throw new AuthorAlreadyHasRatedStory(author.id, story.id);
  }
};

export default async function create(
  mongo: MongoContext,
  redis: AugmentedRedis,
  config: Config,
  broker: CoralEventPublisherBroker,
  tenant: Tenant,
  author: User,
  input: CreateComment,
  nudge: boolean,
  now = new Date(),
  req?: Request
) {
  let log = logger.child(
    {
      authorID: author.id,
      tenantID: tenant.id,
      storyID: input.storyID,
      parentID: input.parentID,
      nudge,
    },
    true
  );

  log.trace("creating comment on story");

  // Grab the story that we'll use to check moderation pieces with.
  const story = await retrieveStory(mongo, tenant.id, input.storyID);
  if (!story) {
    throw new StoryNotFoundError(input.storyID);
  }

  if (story.isArchiving || story.isArchived) {
    throw new CannotCreateCommentOnArchivedStory(tenant.id, story.id);
  }

  // Check if the user is banned on this site, if they are, throw an error right
  // now.
  // NOTE: this should be removed with attribute based auth checks.
  if (isSiteBanned(author, story.siteID)) {
    // Get the site in question.
    const site = await retrieveSite(mongo, tenant.id, story.siteID);
    if (!site) {
      throw new Error(`referenced site not found: ${story.siteID}`);
    }

    throw new UserSiteBanned(author.id, site.id, site.name);
  }

  // Get the story mode of this Story.
  const storyMode = resolveStoryMode(story.settings, tenant);

  // Perform some extra validation depending on the story mode.
  if (isNumber(input.rating)) {
    if (storyMode !== GQLSTORY_MODE.RATINGS_AND_REVIEWS) {
      throw new Error(
        "rating submitted on story not in ratings and review mode"
      );
    }

    // Looks like the rating has been provided. Ensure that this is not a reply,
    // because replies cannot have a rating.
    if (input.parentID) {
      throw new Error("replies cannot contain a rating");
    }

    // Validate that the rating is a valid number.
    await validateRating(mongo, tenant, author, story, input.rating);
  }

  const ancestorIDs: string[] = [];
  const parent = await retrieveParent(mongo, tenant.id, input);
  if (parent) {
    ancestorIDs.push(parent.id);
    if (hasAncestors(parent)) {
      // Push the parent's ancestors id's into the comment's ancestor id's.
      ancestorIDs.push(...parent.ancestorIDs);
    }

    log.trace(
      { ancestorIDs: ancestorIDs.length },
      "pushed parent ancestorIDs into comment"
    );

    const ancestors = await retrieveManyComments(
      mongo.comments(),
      tenant.id,
      ancestorIDs
    );
    const rejectedAncestor = ancestors.find(
      (ancestor) => ancestor?.status === GQLCOMMENT_STATUS.REJECTED
    );

    if (rejectedAncestor) {
      throw new AncestorRejectedError(tenant.id, rejectedAncestor.id);
    }
  }

  let media: CommentMedia | undefined;
  if (input.media) {
    media = await attachMedia(tenant, input.media, input.body);
  }

  let result: PhaseResult;
  try {
    // Run the comment through the moderation phases.
    result = await processForModeration({
      action: "NEW",
      log,
      mongo,
      redis,
      config,
      tenant,
      story,
      storyMode,
      nudge,
      parent,
      comment: { ...input, ancestorIDs },
      author,
      req,
      now,
      media,
    });
  } catch (err) {
    if (
      err instanceof CoralError &&
      err.type === ERROR_TYPES.MODERATION_NUDGE_ERROR
    ) {
      log.info({ err }, "detected pipeline nudge");
    }

    throw err;
  }

  // This is the first time this comment is being published.. So we need to
  // ensure we don't run into any race conditions when we create the comment.
  // One of the situations where we could encounter a race is when the comment
  // is created, and does not have it's flag data associated with it. This would
  // cause the comment to not be added to the flagged queue. If a flag is
  // pending, and a user flags this comment before the next step can proceed,
  // then we would end up double adding the comment to the flagged queue.
  // Instead, we need to add the action metadata to the comment before we add it
  // for the first time to ensure that the data is there for when the next flag
  // is added, that it can already know that the comment is already in the
  // queue.
  let actionCounts: EncodedCommentActionCounts = {};
  if (result.actions.length > 0) {
    // Determine the unique actions, we will use this to compute the comment
    // action counts. This should match what is added below.
    actionCounts = encodeActionCounts(
      ...filterDuplicateActions(result.actions)
    );
  }

  // Create the comment!
  const { comment, revision } = await createComment(
    mongo,
    tenant.id,
    {
      ...input,
      siteID: story.siteID,
      // Copy the current story section into the comment if it exists.
      section: story.metadata?.section,
      // Remap the tags to include the createdAt.
      tags: result.tags.map((tag) => ({ type: tag, createdAt: now })),
      body: result.body,
      status: result.status,
      ancestorIDs,
      metadata: result.metadata,
      actionCounts,
      media,
    },
    now
  );

  log = log.child(
    { commentID: comment.id, status: result.status, revisionID: revision.id },
    true
  );

  // Updating some associated data.
  await Promise.all([
    updateUserLastCommentID(redis, tenant, author, comment.id),
    updateStoryLastCommentedAt(mongo, tenant.id, story.id, now),
    markCommentAsAnswered(
      mongo,
      redis,
      broker,
      tenant,
      comment,
      story,
      author,
      now
    ),
    markSeenComments(
      mongo,
      tenant.id,
      comment.storyID,
      author.id,
      [comment.id],
      now
    ),
  ]);

  log.trace("comment created");

  if (input.parentID) {
    // Push the child's ID onto the parent.
    await pushChildCommentIDOntoParent(
      mongo,
      tenant.id,
      input.parentID,
      comment.id
    );

    log.trace("pushed child comment id onto parent");
  }

  if (result.actions.length > 0) {
    // Actually add the actions to the database. This will not interact with the
    // counts at all.
    await addCommentActions(
      mongo,
      tenant,
      result.actions.map(
        (action): CreateAction => ({
          ...action,
          commentID: comment.id,
          commentRevisionID: revision.id,
          storyID: story.id,
          siteID: story.siteID,
          section: story.metadata?.section,

          // All these actions are created by the system.
          userID: null,
        })
      ),
      now
    );
  }

  // Update all the comment counts on stories and users.
  const counts = await updateAllCommentCounts(mongo, redis, {
    tenant,
    actionCounts,
    after: comment,
  });

  // Publish changes to the event publisher.
  await publishChanges(broker, {
    ...counts,
    after: comment,
    commentRevisionID: revision.id,
  });

  return comment;
}
