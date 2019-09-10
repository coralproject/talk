import { Collection, Db } from "mongodb";

import { CommentAction } from "coral-server/models/action/comment";
import { createCollection } from "coral-server/models/helpers";
import { Story } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";

const BATCH_SIZE = 500;

// TODO: extract this out to a separate file so it can be re-used elsewhere
const collections = {
  users: createCollection<User>("users"),
  comments: createCollection<Comment>("comments"),
  stories: createCollection<Story>("stories"),
  tenants: createCollection<Tenant>("tenants"),
  commentActions: createCollection<CommentAction>("commentActions"),
};

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
    .find({ tenantID, userID, actionType: "REACTION" });
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
    actionType: "REACTION",
  });
}

async function deleteUserComments(
  mongo: Db,
  authorID: string,
  tenantID: string
) {
  await collections.comments(mongo).updateMany(
    { tenantID, authorID },
    {
      $set: {
        authorID: null,
        revisions: [],
        tags: [],
        deleted: true,
      },
    }
  );
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
  await deleteUserComments(mongo, userID, tenantID);

  // Mark the user as deleted.
  const result = await collections.users(mongo).findOneAndUpdate(
    { tenantID, id: userID },
    {
      $set: {
        profiles: [],
        deletedAt: now,
      },
      $unset: {
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
