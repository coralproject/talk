import { CronCommand, CronJob } from "cron";
import { DateTime } from "luxon";
import { Collection, Db } from "mongodb";

import logger from "coral-server/logger";
import { CommentAction } from "coral-server/models/action/comment";
import { createCollection } from "coral-server/models/helpers";
import { Story } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import { MailerQueue } from "coral-server/queue/tasks/mailer";

const BATCH_SIZE = 500;

// TODO: extract this out to a separate file so it
// can be re-used elsewhere
const collections = {
  users: createCollection<User>("users"),
  comments: createCollection<Comment>("comments"),
  stories: createCollection<Story>("stories"),
  tenants: createCollection<Tenant>("tenants"),
  commentActions: createCollection<CommentAction>("commentActions"),
};

export function registerAccountDeletion(
  mongo: Db,
  mailer: MailerQueue
): CronJob {
  const job = new CronJob({
    cronTime: "0,30 * * * *",
    timeZone: "America/New_York",
    start: true,
    runOnInit: false,
    onTick: deleteScheduledAccounts(mongo, mailer),
  });

  if (job.running) {
    logger.info("account deletion scheduler now running");
  }

  return job;
}

function deleteScheduledAccounts(mongo: Db, mailer: MailerQueue): CronCommand {
  return async () => {
    try {
      logger.info("checking for accounts that require deletion");

      // TODO: iterate over tenants in tenant cache
      while (true) {
        const now = new Date();
        const rescheduledDeletionDate = DateTime.fromJSDate(now)
          .plus({ hours: 1 })
          .toJSDate();

        const userResult = await collections.users(mongo).findOneAndUpdate(
          {
            scheduledDeletionDate: { $lte: now },
          },
          {
            $set: {
              scheduledDeletionDate: rescheduledDeletionDate,
            },
          },
          {
            // We want to get back the user with
            // modified scheduledDeletionDate
            returnOriginal: false,
          }
        );

        if (!userResult.value) {
          logger.info("no more users were scheduled for deletion");
          break;
        }

        const userToDelete = userResult.value;

        logger.info(
          { userID: userToDelete.id, tenantID: userToDelete.tenantID },
          `deleting user`
        );

        deleteUser(mongo, mailer, userToDelete.id, userToDelete.tenantID, now);
      }
    } catch (error) {
      logger.error(
        { error },
        "an error occurred trying to perform scheduled account deletions"
      );
    }
  };
}

async function executeBulkOperations<T>(
  collection: Collection<T>,
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
    await executeBulkOperations<Comment>(
      collections.comments(db),
      batch.comments
    );
    batch.comments = [];

    await executeBulkOperations<Story>(collections.stories(db), batch.stories);
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

  await collections.commentActions(db).deleteMany({
    userID,
    actionType: "REACTION",
  });
}

async function deleteUserComments(db: Db, authorID: string) {
  await collections.comments(db).updateMany(
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

async function deleteUser(
  db: Db,
  mailer: MailerQueue,
  userID: string,
  tenantID: string,
  now: Date
) {
  const user = await collections.users(db).findOne({ id: userID, tenantID });
  if (!user) {
    logger.warn({ userID, tenantID }, `could not find user`);
    return;
  }

  const tenant = await collections.tenants(db).findOne({ id: tenantID });
  if (!tenant) {
    logger.warn({ userID, tenantID }, `could not find tenant`);
    return;
  }

  await deleteUserActionCounts(db, userID);
  await deleteUserComments(db, userID);

  collections.users(db).updateOne(
    { id: userID },
    {
      $set: {
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
        name: "account-notification/delete-request-completed",
        context: {
          organizationContactEmail: tenant.organization.contactEmail,
          organizationName: tenant.organization.name,
          organizationURL: tenant.organization.url,
        },
      },
    });
  }
}
