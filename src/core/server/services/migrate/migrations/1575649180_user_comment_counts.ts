import { Db } from "mongodb";

import Migration from "coral-server/services/migrate/migration";
import collections from "coral-server/services/mongodb/collections";

import { GQLCOMMENT_STATUS } from "coral-server/graph/tenant/schema/__generated__/types";

import { MigrationError } from "../error";

export default class extends Migration {
  public async up(mongo: Db, tenantID: string) {
    const userIdsTouched = new Array<string>();

    try {
      const usersToUpdate = collections.users(mongo).find({
        tenantID,
        commentCounts: { $exists: false },
      });

      await usersToUpdate.forEach(async user => {
        const comments = collections.comments(mongo).find({
          tenantID,
          authorID: user.id,
        });

        const tallies = {
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
              tallies.approved += 1;
              break;
            case GQLCOMMENT_STATUS.REJECTED:
              tallies.rejected += 1;
              break;
            case GQLCOMMENT_STATUS.NONE:
              tallies.none += 1;
              break;
            case GQLCOMMENT_STATUS.PREMOD:
              tallies.premod += 1;
              break;
            case GQLCOMMENT_STATUS.SYSTEM_WITHHELD:
              tallies.systemWithheld += 1;
              break;
          }
        });

        userIdsTouched.push(user.id);

        const result = await collections.users(mongo).updateOne(
          {
            tenantID,
            id: user.id,
          },
          {
            $set: {
              commentCounts: {
                statuses: {
                  APPROVED: tallies.approved,
                  REJECTED: tallies.rejected,
                  NONE: tallies.none,
                  PREMOD: tallies.premod,
                  SYSTEM_WITHHELD: tallies.systemWithheld,
                },
              },
            },
          }
        );

        if (result.modifiedCount === 0) {
          throw new MigrationError(
            tenantID,
            "Failed to update user's comment counts.",
            "users",
            userIdsTouched
          );
        }
      });
    } catch (err) {
      throw new MigrationError(
        tenantID,
        "Failed to update user's comment counts.",
        "users",
        userIdsTouched
      );
    }
  }
}
