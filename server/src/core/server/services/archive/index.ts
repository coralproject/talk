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

  const targetStory = await mongo.stories().findOne({ id, tenantID });
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
  const targetCommentModerationActions = {
    tenantID,
    storyID: id,
  };

  logger.info("archiving comments");
  await moveDocuments({
    tenantID,
    source: mongo.comments(),
    filter: targetComments,
    destination: mongo.archivedComments(),
    returnMovedIDs: true,
  });

  logger.info("archiving comment actions");
  await moveDocuments({
    tenantID,
    source: mongo.commentActions(),
    filter: targetCommentActions,
    destination: mongo.archivedCommentActions(),
  });
  logger.info("archiving comment moderation actions");
  await moveDocuments({
    tenantID,
    source: mongo.commentModerationActions(),
    filter: targetCommentModerationActions,
    destination: mongo.archivedCommentModerationActions(),
  });

  // negate the comment counts so we can subtract them from the
  // site and shared comment counts
  const commentCounts = negateCommentCounts({
    commentCounts: targetStory.commentCounts,
    negate: true,
  });

  logger.info("updating site counts for archive");
  await updateSiteCounts(mongo, tenantID, targetStory.siteID, commentCounts);
  logger.info("updating shared counts for archive");
  await updateSharedCommentCounts(redis, tenantID, commentCounts);

  logger.info("marking story as archived");
  const result = await markStoryAsArchived(mongo, tenantID, id, now);

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

  const targetStory = await mongo.stories().findOne({ id, tenantID });
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
  const targetCommentModerationActions = {
    tenantID,
    storyID: id,
  };

  logger.info("unarchiving comments");
  await moveDocuments({
    tenantID,
    source: mongo.archivedComments(),
    filter: targetComments,
    destination: mongo.comments(),
    returnMovedIDs: true,
  });

  logger.info("unarchiving comment actions");
  await moveDocuments({
    tenantID,
    source: mongo.archivedCommentActions(),
    filter: targetCommentActions,
    destination: mongo.commentActions(),
  });

  logger.info("unarchiving comment moderation actions");
  await moveDocuments({
    tenantID,
    source: mongo.archivedCommentModerationActions(),
    filter: targetCommentModerationActions,
    destination: mongo.commentModerationActions(),
  });

  // get the comment counts so we can add them to the
  // site and shared comment counts
  const commentCounts = negateCommentCounts({
    commentCounts: targetStory.commentCounts,
    negate: false,
  });

  logger.info("updating site counts for unarchive");
  await updateSiteCounts(mongo, tenantID, targetStory.siteID, commentCounts);

  logger.info("updating shared counts for unarchive");
  await updateSharedCommentCounts(redis, tenantID, commentCounts);

  logger.info("marking story as unarchived");
  const result = await markStoryAsUnarchived(mongo, tenantID, id, now);

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
