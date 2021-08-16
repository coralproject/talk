import { MongoContext } from "coral-server/data/context";
import { StoryNotFoundError } from "coral-server/errors";
import {
  createEmptyRelatedCommentCounts,
  RelatedCommentCounts,
  updateSharedCommentCounts,
} from "coral-server/models/comment/counts";
import { updateSiteCounts } from "coral-server/models/site";
import { Story } from "coral-server/models/story";
import {
  archivedCommentActions,
  archivedCommentModerationActions,
  archivedComments,
  commentActions,
  commentModerationActions,
  comments,
  stories,
} from "coral-server/services/mongodb/collections";
import { AugmentedRedis } from "coral-server/services/redis";

const getCommentCounts = (options: {
  story: Readonly<Story>;
  negate: boolean;
}) => {
  const {
    story: { commentCounts },
    negate,
  } = options;
  const multiplier = negate ? -1 : 1;

  const result: RelatedCommentCounts = createEmptyRelatedCommentCounts();

  if (commentCounts.action) {
    for (const key in commentCounts.action) {
      if (result.action.hasOwnProperty.call(commentCounts.action, key)) {
        const value = commentCounts.action[key];
        result.action[key] = value * multiplier;
      }
    }
  }

  if (commentCounts.moderationQueue) {
    result.moderationQueue.total =
      commentCounts.moderationQueue.total * multiplier;

    let key: keyof typeof commentCounts.moderationQueue.queues;
    for (key in commentCounts.moderationQueue.queues) {
      if (
        result.moderationQueue.queues.hasOwnProperty.call(
          commentCounts.moderationQueue.queues,
          key
        )
      ) {
        const value = commentCounts.moderationQueue.queues[key];
        result.moderationQueue.queues[key] = value * multiplier;
      }
    }
  }

  if (commentCounts.status) {
    let key: keyof typeof commentCounts.status;
    for (key in commentCounts.status) {
      if (result.status.hasOwnProperty.call(commentCounts.status, key)) {
        const value = commentCounts.status[key];
        result.status[key] = value * multiplier;
      }
    }
  }

  return result;
};

export async function archiveStory(
  mongo: MongoContext,
  redis: AugmentedRedis,
  tenantID: string,
  id: string
) {
  const targetStory = await stories(mongo.main).findOne({ id, tenantID });
  if (!targetStory) {
    throw new StoryNotFoundError(id);
  }

  if (targetStory.isArchived) {
    return;
  }

  const targetComments = await comments(mongo.main)
    .find({ tenantID, storyID: id })
    .toArray();
  const targetCommentActions = await commentActions(mongo.main)
    .find({
      tenantID,
      storyID: id,
    })
    .toArray();
  const targetCommentIDs = targetComments.map((c) => c.id);
  const targetCommentModerationActions = await commentModerationActions(
    mongo.main
  )
    .find({
      tenantID,
      commentID: { $in: targetCommentIDs },
    })
    .toArray();

  if (targetComments && targetComments.length > 0) {
    await archivedComments(mongo.archive).insertMany(targetComments);
  }
  if (targetCommentActions && targetCommentActions.length > 0) {
    await archivedCommentActions(mongo.archive).insertMany(
      targetCommentActions
    );
  }
  if (
    targetCommentModerationActions &&
    targetCommentModerationActions.length > 0
  ) {
    await archivedCommentModerationActions(mongo.archive).insertMany(
      targetCommentModerationActions
    );
  }

  await comments(mongo.main).remove({ tenantID, storyID: id });
  await commentActions(mongo.main).remove({ tenantID, storyID: id });

  if (targetCommentIDs && targetCommentIDs.length > 0) {
    await commentModerationActions(mongo.main).remove({
      tenantID,
      commentID: { $in: targetCommentIDs },
    });
  }

  // negate the comment counts so we can subtract them from the
  // site and shared comment counts
  const commentCounts = getCommentCounts({
    story: targetStory,
    negate: true,
  });

  await updateSiteCounts(mongo.main, tenantID, id, commentCounts);
  await updateSharedCommentCounts(redis, tenantID, commentCounts);

  const result = await stories(mongo.main).findOneAndUpdate(
    { id, tenantID },
    {
      $set: {
        isArchiving: false,
        isArchived: true,
      },
    },
    {
      returnOriginal: false,
    }
  );

  return result.value;
}

export async function unarchiveStory(
  mongo: MongoContext,
  redis: AugmentedRedis,
  tenantID: string,
  id: string
) {
  const targetStory = await stories(mongo.main).findOne({ id, tenantID });
  if (!targetStory) {
    throw new StoryNotFoundError(id);
  }

  if (!targetStory.isArchived) {
    return;
  }

  const targetComments = await archivedComments(mongo.archive)
    .find({ tenantID, storyID: id })
    .toArray();
  const targetCommentActions = await archivedCommentActions(mongo.archive)
    .find({
      tenantID,
      storyID: id,
    })
    .toArray();
  const targetCommentIDs = targetComments.map((c) => c.id);
  const targetCommentModerationActions = await archivedCommentModerationActions(
    mongo.archive
  )
    .find({
      tenantID,
      commentID: { $in: targetCommentIDs },
    })
    .toArray();

  if (targetComments && targetComments.length > 0) {
    await comments(mongo.main).insertMany(targetComments);
  }
  if (targetCommentActions && targetCommentActions.length > 0) {
    await commentActions(mongo.main).insertMany(targetCommentActions);
  }
  if (
    targetCommentModerationActions &&
    targetCommentModerationActions.length > 0
  ) {
    await commentModerationActions(mongo.main).insertMany(
      targetCommentModerationActions
    );
  }

  await archivedComments(mongo.archive).remove({ tenantID, storyID: id });
  await archivedCommentActions(mongo.archive).remove({ tenantID, storyID: id });
  if (targetCommentIDs && targetCommentIDs.length > 0) {
    await archivedCommentModerationActions(mongo.archive).remove({
      tenantID,
      commentID: { $in: targetCommentIDs },
    });
  }

  // get the comment counts so we can add them to the
  // site and shared comment counts
  const commentCounts = getCommentCounts({
    story: targetStory,
    negate: false,
  });

  await updateSiteCounts(mongo.main, tenantID, id, commentCounts);
  await updateSharedCommentCounts(redis, tenantID, commentCounts);

  const result = await stories(mongo.main).findOneAndUpdate(
    { id, tenantID },
    {
      $set: {
        isArchiving: false,
        isArchived: false,
      },
    },
    {
      returnOriginal: false,
    }
  );

  return result.value;
}
