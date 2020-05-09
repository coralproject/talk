import { Db } from "mongodb";

import { ERROR_TYPES } from "coral-common/errors";
import { Config } from "coral-server/config";
import {
  CommentNotFoundError,
  CoralError,
  StoryNotFoundError,
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
  createComment,
  CreateCommentInput,
  pushChildCommentIDOntoParent,
  retrieveComment,
} from "coral-server/models/comment";
import {
  getDepth,
  hasAncestors,
  hasPublishedStatus,
} from "coral-server/models/comment/helpers";
import {
  retrieveStory,
  Story,
  updateStoryLastCommentedAt,
} from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import { removeTag } from "coral-server/services/comments";
import {
  addCommentActions,
  CreateAction,
} from "coral-server/services/comments/actions";
import {
  PhaseResult,
  processForModeration,
} from "coral-server/services/comments/pipeline";
import { AugmentedRedis } from "coral-server/services/redis";
import { updateUserLastCommentID } from "coral-server/services/users";
import { Request } from "coral-server/types/express";

import {
  GQLSTORY_MODE,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

import approveComment from "./approveComment";
import { publishChanges, updateAllCommentCounts } from "./helpers";

export type CreateComment = Omit<
  CreateCommentInput,
  "status" | "metadata" | "ancestorIDs" | "actionCounts" | "tags" | "siteID"
>;

const markCommentAsAnswered = async (
  mongo: Db,
  redis: AugmentedRedis,
  broker: CoralEventPublisherBroker,
  tenant: Tenant,
  comment: Readonly<Comment>,
  story: Story,
  author: User,
  now: Date
) => {
  // We only process this if we're in Q&A mode.
  if (story.settings.mode !== GQLSTORY_MODE.QA) {
    return;
  }

  // Answers are always a reply to another comment.
  // If we have a parentID and a parentRevisionID, then
  // we have a parent, which means we are replying.
  if (!comment.parentID || !comment.parentRevisionID) {
    return;
  }

  // If we have no experts, there cannot be anyone
  // providing expert answers.
  if (!story.settings.expertIDs) {
    return;
  }

  if (
    // If we are the export on this story...
    story.settings.expertIDs.some((id) => id === author.id) &&
    // And this is the first reply (depth of 1)...
    getDepth(comment) === 1
  ) {
    // We need to mark the parent question as answered.
    // - Remove the unanswered tag.
    // - Approve it since an expert has replied to it.
    await removeTag(mongo, tenant, comment.parentID, GQLTAG.UNANSWERED);
    await approveComment(
      mongo,
      redis,
      broker,
      tenant,
      comment.parentID,
      comment.parentRevisionID,
      author.id,
      now
    );
  }
};

export default async function create(
  mongo: Db,
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

  const ancestorIDs: string[] = [];
  if (input.parentID) {
    // Check to see that the reference parent ID exists.
    const parent = await retrieveComment(mongo, tenant.id, input.parentID);
    if (!parent) {
      throw new CommentNotFoundError(input.parentID);
    }

    // Check that the parent comment was visible.
    if (!hasPublishedStatus(parent)) {
      throw new CommentNotFoundError(parent.id);
    }

    ancestorIDs.push(input.parentID);
    if (hasAncestors(parent)) {
      // Push the parent's ancestors id's into the comment's ancestor id's.
      ancestorIDs.push(...parent.ancestorIDs);
    }

    log.trace(
      { ancestorIDs: ancestorIDs.length },
      "pushed parent ancestorIDs into comment"
    );
  }

  let result: PhaseResult;
  try {
    // Run the comment through the moderation phases.
    result = await processForModeration({
      log,
      mongo,
      redis,
      config,
      action: "NEW",
      tenant,
      story,
      nudge,
      comment: { ...input, ancestorIDs },
      author,
      req,
      now,
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

  const { actions, body, status, metadata, tags } = result;

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
  if (actions.length > 0) {
    // Determine the unique actions, we will use this to compute the comment
    // action counts. This should match what is added below.
    actionCounts = encodeActionCounts(...filterDuplicateActions(actions));
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
      tags: tags.map((tag) => ({ type: tag, createdAt: now })),
      body,
      status,
      ancestorIDs,
      metadata,
      actionCounts,
    },
    now
  );

  log = log.child(
    { commentID: comment.id, status, revisionID: revision.id },
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

  if (actions.length > 0) {
    // Actually add the actions to the database. This will not interact with the
    // counts at all.
    await addCommentActions(
      mongo,
      tenant,
      actions.map(
        (action): CreateAction => ({
          ...action,
          commentID: comment.id,
          commentRevisionID: revision.id,
          storyID: story.id,
          siteID: story.siteID,

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
