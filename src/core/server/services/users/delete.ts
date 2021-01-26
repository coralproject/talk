import { Collection, Db } from "mongodb";

import { ACTION_TYPE } from "coral-server/models/action/comment";
import { Story } from "coral-server/models/story";
import collections from "coral-server/services/mongodb/collections";

import { GQLCOMMENT_STATUS } from "coral-server/graph/schema/__generated__/types";

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

async function deleteUserComments(
  mongo: Db,
  authorID: string,
  tenantID: string,
  now: Date
) {
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

function incCount(counts: any, id: string, amount: number) {
  if (!counts[id]) {
    counts[id] = 0;
  }

  counts[id] += amount;
}

export async function moveDeletedComments(
  mongo: Db,
  tenantID: string,
  now: Date
) {
  const commentsBatch: any[] = [];

  const siteCounts: any = {};
  const userCounts: any = {};

  const modQueueCounts = {
    unmoderated: 0,
    pending: 0,
    reported: 0,
  };

  const cursor = collections
    .comments(mongo)
    .find({ tenantID, $lte: { deletedAt: now } });
  while (await cursor.hasNext()) {
    const action = await cursor.next();
    if (!action) {
      continue;
    }

    const revision =
      action.revisions.length > 0
        ? action.revisions[action.revisions.length - 1]
        : null;
    if (revision === null) {
      continue;
    }

    const reject = () => {
      commentsBatch.push({
        updateOne: {
          filter: { tenantID, id: action.id },
          update: {
            $set: { status: GQLCOMMENT_STATUS.REJECTED },
          },
        },
      });
      incCount(siteCounts, action.siteID, -1);
      if (action.authorID) {
        incCount(userCounts, action.authorID, -1);
      }
    };

    const approve = () => {
      commentsBatch.push({
        updateOne: {
          filter: { tenantID, id: action.id },
          update: {
            $set: { status: GQLCOMMENT_STATUS.APPROVED },
          },
        },
      });

      incCount(siteCounts, action.siteID, 1);
      if (action.authorID) {
        incCount(userCounts, action.authorID, 1);
      }
    };

    switch (action.status) {
      case GQLCOMMENT_STATUS.SYSTEM_WITHHELD:
        reject();
        modQueueCounts.pending -= 1;
        break;
      case GQLCOMMENT_STATUS.PREMOD:
      case GQLCOMMENT_STATUS.NONE:
        approve();
        modQueueCounts.unmoderated -= 1;
        break;
      default: // do nothing
    }
  }
}

export async function deleteUser(
  mongo: Db,
  userID: string,
  tenantID: string,
  now: Date
) {
  const user = await collections.users(mongo).findOne({ id: userID, tenantID });
  if (!user) {
    throw new Error("could not find user by ID");
  }

  // Check to see if the user was already deleted.
  if (user.deletedAt) {
    throw new Error("user was already deleted");
  }

  const tenant = await collections.tenants(mongo).findOne({ id: tenantID });
  if (!tenant) {
    throw new Error("could not find tenant by ID");
  }

  // Delete the user's action counts.
  await deleteUserActionCounts(mongo, userID, tenantID);

  // Delete the user's comments.
  await deleteUserComments(mongo, userID, tenantID, now);

  // Mark the user as deleted.
  const result = await collections.users(mongo).findOneAndUpdate(
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

  return result.value || null;
}
