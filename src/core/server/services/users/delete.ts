import { Collection, Db, FilterQuery } from "mongodb";

import { MongoContext } from "coral-server/data/context";
import { ACTION_TYPE } from "coral-server/models/action/comment";
import { Comment, getLatestRevision } from "coral-server/models/comment";
import { Story } from "coral-server/models/story";
import { retrieveTenant } from "coral-server/models/tenant";
import collections from "coral-server/services/mongodb/collections";
import { updateAllCommentCounts } from "coral-server/stacks/helpers";

import { GQLCOMMENT_STATUS } from "coral-server/graph/schema/__generated__/types";

import { moderate } from "../comments/moderation";
import { AugmentedRedis } from "../redis";

const BATCH_SIZE = 500;

async function executeBulkOperations<T>(
  collection: Collection<T>,
  operations: any[]
) {
  // TODO: (wyattjoh) fix types here to support actual types when upstream changes applied
  const bulk: any = collection.initializeUnorderedBulkOp();

  for (const operation of operations) {
    bulk.raw(operation);
  }

  await bulk.execute();
}

interface Batch {
  comments: any[];
  stories: any[];
}

async function deleteUserActionCounts(
  mongo: Db,
  userID: string,
  tenantID: string
) {
  const batch: Batch = {
    comments: [],
    stories: [],
  };

  async function processBatch() {
    await executeBulkOperations<Comment>(
      collections.comments(mongo),
      batch.comments
    );
    batch.comments = [];

    await executeBulkOperations<Story>(
      collections.stories(mongo),
      batch.stories
    );
    batch.stories = [];
  }

  const cursor = collections
    .commentActions(mongo)
    .find({ tenantID, userID, actionType: ACTION_TYPE.REACTION });
  while (await cursor.hasNext()) {
    const action = await cursor.next();
    if (!action) {
      continue;
    }

    batch.comments.push({
      updateOne: {
        filter: { tenantID, id: action.commentID },
        update: {
          $inc: {
            "revisions.$[revisions].actionCounts.REACTION": -1,
            "actionCounts.REACTION": -1,
          },
        },
        arrayFilters: [{ "revisions.id": action.commentRevisionID }],
      },
    });

    batch.stories.push({
      updateOne: {
        filter: { tenantID, id: action.storyID },
        update: {
          $inc: {
            "commentCounts.action.REACTION": -1,
          },
        },
      },
    });

    if (
      batch.comments.length >= BATCH_SIZE ||
      batch.stories.length >= BATCH_SIZE
    ) {
      await processBatch();
    }
  }

  if (batch.comments.length > 0 || batch.stories.length > 0) {
    await processBatch();
  }

  await collections.commentActions(mongo).deleteMany({
    tenantID,
    userID,
    actionType: ACTION_TYPE.REACTION,
  });
}

async function moderateComments(
  mongo: Db,
  redis: AugmentedRedis,
  tenantID: string,
  filter: FilterQuery<Comment>,
  targetStatus: GQLCOMMENT_STATUS,
  now: Date
) {
  const tenant = await retrieveTenant(mongo, tenantID);
  if (!tenant) {
    throw new Error("unable to retrieve tenant");
  }

  const comments = collections.comments(mongo).find(filter);

  while (await comments.hasNext()) {
    const comment = await comments.next();
    if (!comment) {
      continue;
    }

    const result = await moderate(
      mongo,
      tenant,
      {
        commentID: comment.id,
        commentRevisionID: getLatestRevision(comment).id,
        moderatorID: null,
        status: targetStatus,
      },
      now
    );

    if (!result.after) {
      continue;
    }

    await updateAllCommentCounts(
      mongo,
      redis,
      {
        ...result,
        tenant,
        // Rejecting a comment does not change the action counts.
        actionCounts: {},
      },
      {
        updateShared: false,
        updateSite: false,
        updateStory: true,
        updateUser: true,
      }
    );
  }
}

async function deleteUserComments(
  mongo: Db,
  redis: AugmentedRedis,
  authorID: string,
  tenantID: string,
  now: Date
) {
  // Approve any comments that have children.
  // This allows the children to be visible after
  // the comment is deleted.
  await moderateComments(
    mongo,
    redis,
    tenantID,
    {
      tenantID,
      authorID,
      status: GQLCOMMENT_STATUS.NONE,
      childCount: { $gt: 0 },
    },
    GQLCOMMENT_STATUS.APPROVED,
    now
  );

  // reject any comments that don't have children
  // This gets rid of any empty/childless deleted comments.
  await moderateComments(
    mongo,
    redis,
    tenantID,
    {
      tenantID,
      authorID,
      status: {
        $in: [
          GQLCOMMENT_STATUS.PREMOD,
          GQLCOMMENT_STATUS.SYSTEM_WITHHELD,
          GQLCOMMENT_STATUS.NONE,
          GQLCOMMENT_STATUS.APPROVED,
        ],
      },
      childCount: 0,
    },
    GQLCOMMENT_STATUS.REJECTED,
    now
  );

  await collections.comments(mongo).updateMany(
    { tenantID, authorID },
    {
      $set: {
        authorID: null,
        revisions: [],
        tags: [],
        deletedAt: now,
      },
    }
  );
}

export async function deleteUser(
  mongo: MongoContext,
  redis: AugmentedRedis,
  userID: string,
  tenantID: string,
  now: Date
) {
  const user = await collections
    .users(mongo.live)
    .findOne({ id: userID, tenantID });
  if (!user) {
    throw new Error("could not find user by ID");
  }

  // Check to see if the user was already deleted.
  if (user.deletedAt) {
    throw new Error("user was already deleted");
  }

  const tenant = await collections
    .tenants(mongo.live)
    .findOne({ id: tenantID });
  if (!tenant) {
    throw new Error("could not find tenant by ID");
  }

  // Delete the user's action counts.
  await deleteUserActionCounts(mongo.live, userID, tenantID);
  await deleteUserActionCounts(mongo.archive, userID, tenantID);

  // Delete the user's comments.
  await deleteUserComments(mongo.live, redis, userID, tenantID, now);
  await deleteUserComments(mongo.archive, redis, userID, tenantID, now);

  // Mark the user as deleted.
  const result = await collections.users(mongo.live).findOneAndUpdate(
    { tenantID, id: userID },
    {
      $set: {
        deletedAt: now,
      },
      $unset: {
        profiles: "",
        email: "",
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );

  // Delete the user's archived action counts.
  await deleteUserActionCounts(mongo.archive, userID, tenantID);

  // Delete the user's archived comments.
  await deleteUserComments(mongo.archive, redis, userID, tenantID, now);

  return result.value || null;
}
