import { Db } from "mongodb";

import Migration from "coral-server/services/migrate/migration";
import collections from "coral-server/services/mongodb/collections";

import { GQLCOMMENT_STATUS } from "coral-server/graph/tenant/schema/__generated__/types";

import { MigrationError } from "../error";

const BATCH_SIZE = 50;

interface Tally {
  approved: number;
  rejected: number;
  none: number;
  premod: number;
  systemWithheld: number;
}

interface UserUpdate {
  userID: string;
  tally: Tally;
}

async function updateBatchedCommentCounts(
  mongo: Db,
  tenantID: string,
  items: UserUpdate[]
) {
  const bulkOps = items.map(item => {
    return {
      updateOne: {
        filter: {
          tenantID,
          id: item.userID,
        },
        update: {
          $set: {
            commentCounts: {
              statuses: {
                APPROVED: item.tally.approved,
                REJECTED: item.tally.rejected,
                NONE: item.tally.none,
                PREMOD: item.tally.premod,
                SYSTEM_WITHHELD: item.tally.systemWithheld,
              },
            },
          },
        },
      },
    };
  });

  const result = await collections.users(mongo).bulkWrite(bulkOps);

  if (result.modifiedCount !== items.length) {
    throw new MigrationError(
      tenantID,
      "Failed to update user's comment counts.",
      "users",
      items.map(it => it.userID)
    );
  }
}

export default class extends Migration {
  public async up(mongo: Db, tenantID: string) {
    const users = collections.users(mongo).find({
      tenantID,
      commentCounts: { $exists: false },
    });

    const usersToUpdate = new Array<UserUpdate>();

    while (await users.hasNext()) {
      const user = await users.next();
      if (!user) {
        break;
      }

      const comments = collections.comments(mongo).find({
        tenantID,
        authorID: user.id,
      });

      const tally = {
        approved: 0,
        rejected: 0,
        none: 0,
        premod: 0,
        systemWithheld: 0,
      };

      await comments.forEach(comment => {
        const status = comment.status;
        switch (status) {
          case GQLCOMMENT_STATUS.APPROVED:
            tally.approved += 1;
            break;
          case GQLCOMMENT_STATUS.REJECTED:
            tally.rejected += 1;
            break;
          case GQLCOMMENT_STATUS.NONE:
            tally.none += 1;
            break;
          case GQLCOMMENT_STATUS.PREMOD:
            tally.premod += 1;
            break;
          case GQLCOMMENT_STATUS.SYSTEM_WITHHELD:
            tally.systemWithheld += 1;
            break;
        }
      });

      usersToUpdate.push({
        userID: user.id,
        tally,
      });

      if (usersToUpdate.length >= BATCH_SIZE) {
        await updateBatchedCommentCounts(mongo, tenantID, usersToUpdate);
        usersToUpdate.length = 0;
      }
    }

    if (usersToUpdate.length > 0) {
      await updateBatchedCommentCounts(mongo, tenantID, usersToUpdate);
      usersToUpdate.length = 0;
    }
  }
}
