import { Collection, FilterQuery } from "mongodb";

import { MongoContext } from "coral-server/data/context";
import { StoryNotFoundError } from "coral-server/errors";
import { Logger } from "coral-server/logger";
import {
  negateCommentCounts,
  updateSharedCommentCounts,
} from "coral-server/models/comment/counts";
import { updateSiteCounts } from "coral-server/models/site";
import {
  markStoryAsArchived,
  markStoryAsUnarchived,
} from "coral-server/models/story";
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

export async function archiveStory(
  mongo: MongoContext,
  redis: AugmentedRedis,
  tenantID: string,
  id: string,
  log: Logger,
  now: Date
) {
  if (!mongo.archive) {
    throw new Error("Cannot archive, archive connection is not initialized");
  }

  const logger = log.child({ storyID: id });
  logger.info("starting to archive story");

  const targetStory = await stories(mongo.live).findOne({ id, tenantID });
  if (!targetStory) {
    throw new StoryNotFoundError(id);
  }

  if (targetStory.isArchived) {
    logger.info("story is already archived, exiting");
    return;
  }

  logger.info("story is able to be archived, proceeding");

  const targetComments = {
    tenantID,
    storyID: id,
  };
  const targetCommentActions = {
    tenantID,
    storyID: id,
  };

  logger.info("archiving comments");
  const targetCommentIDs = await moveDocuments({
    tenantID,
    source: comments(mongo.live),
    filter: targetComments,
    destination: archivedComments(mongo.archive),
    returnMovedIDs: true,
  });

  const targetCommentModerationActions = {
    tenantID,
    commentID: { $in: targetCommentIDs },
  };

  logger.info("archiving comment actions");
  await moveDocuments({
    tenantID,
    source: commentActions(mongo.live),
    filter: targetCommentActions,
    destination: archivedCommentActions(mongo.archive),
  });
  logger.info("archiving comment moderation actions");
  await moveDocuments({
    tenantID,
    source: commentModerationActions(mongo.live),
    filter: targetCommentModerationActions,
    destination: archivedCommentModerationActions(mongo.archive),
  });

  // negate the comment counts so we can subtract them from the
  // site and shared comment counts
  const commentCounts = negateCommentCounts({
    commentCounts: targetStory.commentCounts,
    negate: true,
  });

  logger.info("updating site counts for archive");
  await updateSiteCounts(mongo.live, tenantID, id, commentCounts);
  logger.info("updating shared counts for archive");
  await updateSharedCommentCounts(redis, tenantID, commentCounts);

  logger.info("marking story as archived");
  const result = await markStoryAsArchived(mongo.live, tenantID, id, now);

  logger.info("completed archiving tasks");
  return result;
}

export async function unarchiveStory(
  mongo: MongoContext,
  redis: AugmentedRedis,
  tenantID: string,
  id: string,
  log: Logger,
  now: Date
) {
  if (!mongo.archive) {
    throw new Error("Cannot archive, archive connection is not initialized");
  }

  const logger = log.child({ storyID: id });
  logger.info("starting to unarchive story");

  const targetStory = await stories(mongo.live).findOne({ id, tenantID });
  if (!targetStory) {
    throw new StoryNotFoundError(id);
  }

  if (!targetStory.isArchived) {
    logger.info("story is not archived, exiting");
    return;
  }

  logger.info("story is able to be unarchived, proceeding");

  const targetComments = {
    tenantID,
    storyID: id,
  };
  const targetCommentActions = {
    tenantID,
    storyID: id,
  };

  logger.info("unarchiving comments");
  const targetCommentIDs = await moveDocuments({
    tenantID,
    source: archivedComments(mongo.archive),
    filter: targetComments,
    destination: comments(mongo.live),
    returnMovedIDs: true,
  });

  const targetCommentModerationActions = {
    tenantID,
    commentID: { $in: targetCommentIDs },
  };

  logger.info("unarchiving comment actions");
  await moveDocuments({
    tenantID,
    source: archivedCommentActions(mongo.archive),
    filter: targetCommentActions,
    destination: commentActions(mongo.live),
  });

  logger.info("unarchiving comment moderation actions");
  await moveDocuments({
    tenantID,
    source: archivedCommentModerationActions(mongo.archive),
    filter: targetCommentModerationActions,
    destination: commentModerationActions(mongo.live),
  });

  // get the comment counts so we can add them to the
  // site and shared comment counts
  const commentCounts = negateCommentCounts({
    commentCounts: targetStory.commentCounts,
    negate: false,
  });

  logger.info("updating site counts for unarchive");
  await updateSiteCounts(mongo.live, tenantID, id, commentCounts);

  logger.info("updating shared counts for unarchive");
  await updateSharedCommentCounts(redis, tenantID, commentCounts);

  logger.info("marking story as unarchived");
  const result = await markStoryAsUnarchived(mongo.live, tenantID, id, now);

  logger.info("completed unarchiving tasks");
  return result;
}

interface MoveDocumentsOptions<T> {
  tenantID: string;
  source: Collection<T>;
  filter: FilterQuery<T>;
  destination: Collection<T>;
  returnMovedIDs?: boolean;
  batchSize?: number;
}

async function moveDocuments<T extends { id: string }>({
  tenantID,
  source,
  filter,
  destination,
  returnMovedIDs = false,
  batchSize = 100,
}: MoveDocumentsOptions<T>) {
  let insertBatch: T[] = [];
  let deleteIDs: string[] = [];
  const allIDs: string[] = [];

  const selectionCursor = source.find(filter);

  while (await selectionCursor.hasNext()) {
    const document = await selectionCursor.next();
    if (!document) {
      continue;
    }

    insertBatch.push(document);

    deleteIDs.push(document.id);
    if (returnMovedIDs) {
      allIDs.push(document.id);
    }

    if (insertBatch.length >= batchSize) {
      const bulkInsert = destination.initializeUnorderedBulkOp();
      for (const item of insertBatch) {
        bulkInsert.insert(item);
      }
      await bulkInsert.execute();

      const bulkDelete = source.initializeUnorderedBulkOp();
      bulkDelete.find({ tenantID, id: { $in: deleteIDs } }).remove();
      await bulkDelete.execute();

      insertBatch = [];
      deleteIDs = [];
    }
  }

  if (insertBatch.length > 0) {
    const bulkInsert = destination.initializeUnorderedBulkOp();
    for (const item of insertBatch) {
      bulkInsert.insert(item);
    }
    await bulkInsert.execute();
  }
  if (deleteIDs.length > 0) {
    const bulkDelete = source.initializeUnorderedBulkOp();
    bulkDelete.find({ tenantID, id: { $in: deleteIDs } }).remove();
    await bulkDelete.execute();
  }

  return allIDs;
}
