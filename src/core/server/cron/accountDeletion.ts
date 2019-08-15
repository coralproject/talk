import { CronJob } from "cron";
import { DateTime } from "luxon";
import { Collection, Db } from "mongodb";

import logger from "coral-server/logger";
import { createCollection } from "coral-server/models/helpers";
import { Story } from "coral-server/models/story";
import { User } from "coral-server/models/user";

const BATCH_SIZE = 500;

export function registerAccountDeletion(mongo: Db): CronJob {
  const job = new CronJob({
    cronTime: "0,30 * * * * *",
    timeZone: "America/New_York",
    start: true,
    runOnInit: false,
    onTick: async () => {
      deleteScheduledAccounts(mongo);
    },
  });

  if (job.running) {
    logger.info("Account deletion scheduler now running.");
  }

  return job;
}

async function deleteScheduledAccounts(mongo: Db) {
  logger.info(
    "Scheduled account deletion: checking for accounts that require deletion..."
  );

  const users = createCollection<User>("users");

  while (true) {
    const now = new Date();
    const rescheduledDeletionDate = DateTime.fromJSDate(now)
      .plus({ hours: 1 })
      .toJSDate();

    const userResult = await users(mongo).findOneAndUpdate(
      {
        scheduledDeletionDate: { $lte: now },
      },
      {
        $set: {
          scheduledDeletionDate: rescheduledDeletionDate,
        },
      }
    );

    if (
      !userResult.ok ||
      userResult.value === null ||
      userResult.value === undefined
    ) {
      logger.info("No users found that were scheduled for deletion.");
      break;
    }

    const userToDelete = userResult.value;

    logger.info(`Deleting ${userToDelete.username}...`);

    deleteUser(mongo, userToDelete.id, now);
  }
}

async function executeBulkOperations<T>(
  collection: Collection<Readonly<T>>,
  operations: any[]
) {
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

async function deleteUserActionCounts(db: Db, userID: string) {
  const batch: Batch = {
    comments: [],
    stories: [],
  };

  async function processBatch() {
    const comments = createCollection<Comment>("comments")(db);
    await executeBulkOperations<Comment>(comments, batch.comments);
    batch.comments = [];

    const stories = createCollection<Story>("stories")(db);
    await executeBulkOperations<Story>(stories, batch.stories);
    batch.stories = [];
  }

  const cursor = db
    .collection("commentActions")
    .find({ userID, actionType: "REACTION" });
  while (await cursor.hasNext()) {
    const action = await cursor.next();

    batch.comments.push({
      updateOne: {
        filter: { id: action.commentID },
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
        filter: { id: action.storyID },
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

  await db.collection("commentActions").deleteMany({
    userID,
    actionType: "REACTION",
  });
}

async function deleteUserComments(db: Db, authorID: string) {
  // QUESTION: (andrew) what if a comment is PREMOD, do we reject it now?
  // QUESTION: (andrew) what if a comment is SYSTEM_WITHHELD, do we reject it now?

  // NOTE: (nick) if we do either of the above, we need to adjust the story `commentCounts.moderationQueue` (complicated)
  const comments = createCollection<Comment>("comments")(db);
  await comments.updateMany(
    { authorID },
    {
      $set: {
        authorID: null,
        revisions: [],
        tags: [],
      },
    }
  );
}

async function deleteUser(db: Db, id: string, now: Date) {
  await deleteUserActionCounts(db, id);
  await deleteUserComments(db, id);

  const users = createCollection<User>("users")(db);
  users.updateOne(
    { id },
    {
      $set: {
        // QUESTION: (andrew) discuss about retention
        // username: null,
        email: null,
        profiles: [],
        deletedAt: now,
      },
    }
  );
}
