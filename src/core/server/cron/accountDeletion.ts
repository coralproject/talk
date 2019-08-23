import { CronJob } from "cron";
import { DateTime } from "luxon";
import { Collection, Db } from "mongodb";

import logger from "coral-server/logger";
import { createCollection } from "coral-server/models/helpers";
import { Story } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import { MailerQueue } from "coral-server/queue/tasks/mailer";

const BATCH_SIZE = 500;

export function registerAccountDeletion(
  mongo: Db,
  mailer: MailerQueue
): CronJob {
  const job = new CronJob({
    cronTime: "0,30 * * * *",
    timeZone: "America/New_York",
    start: true,
    runOnInit: false,
    onTick: async () => {
      deleteScheduledAccounts(mongo, mailer);
    },
  });

  if (job.running) {
    logger.info("Account deletion scheduler now running.");
  }

  return job;
}

async function deleteScheduledAccounts(mongo: Db, mailer: MailerQueue) {
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

    deleteUser(mongo, mailer, userToDelete.id, now);
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
        deleted: true,
      },
    }
  );
}

async function deleteUser(db: Db, mailer: MailerQueue, id: string, now: Date) {
  const users = createCollection<User>("users")(db);
  const tenants = createCollection<Tenant>("tenants")(db);

  const user = await users.findOne({ id });
  if (!user) {
    logger.warn(`Unable to delete user ${id} as they could not be found.`);
    return;
  }

  const tenant = await tenants.findOne({ id: user.tenantID });
  if (!tenant) {
    logger.warn(
      `Unable to delete user ${id} as we could not find their tenant.`
    );
    return;
  }

  await deleteUserActionCounts(db, id);
  await deleteUserComments(db, id);

  users.updateOne(
    { id },
    {
      $set: {
        // QUESTION: (andrew) discuss about retention
        // username: null,
        profiles: [],
        deletedAt: now,
      },
      $unset: {
        email: "",
      },
    }
  );

  if (user.email) {
    await mailer.add({
      tenantID: tenant.id,
      message: {
        to: user.email,
      },
      template: {
        name: "delete-request-completed",
        context: {
          organizationContactEmail: tenant.organization.contactEmail,
          organizationName: tenant.organization.name,
          organizationURL: tenant.organization.url,
        },
      },
    });
  }
}
