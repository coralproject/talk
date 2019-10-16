import { Db } from "mongodb";

import collections from "coral-server/services/mongodb/collections";

import { MigrationError } from "../error";
import Migration from "../migration";

export default class extends Migration {
  public async down(mongo: Db, tenantID: string) {
    // Remove the premod user status from all users on this Tenant.
    const result = await collections.users(mongo).updateMany(
      {
        tenantID,
        "status.premod": { $ne: null },
      },
      {
        $unset: {
          "status.premod": "",
        },
      }
    );

    this.log(tenantID).warn(
      { matchedCount: result.matchedCount, modifiedCount: result.matchedCount },
      "cleared the premod status from users"
    );
  }

  public async test(mongo: Db, tenantID: string) {
    // Find all the users that still have premod status unset.
    const cursor = collections
      .users(mongo)
      .find({
        "status.premod": null,
        tenantID,
      })
      .project({ id: 1 });

    // Count them.
    const users = await cursor.toArray();
    const count = users.length;
    if (count === 0) {
      this.log(tenantID).info("all users migrated successfully");
      return;
    }

    throw new MigrationError(
      tenantID,
      "found users that were not updated",
      "users",
      users.map(({ id }) => id)
    );
  }

  public async up(mongo: Db, tenantID: string) {
    // Migrate users to include the premod status.
    const result = await collections.users(mongo).updateMany(
      {
        "status.premod": null,
        tenantID,
      },
      {
        $set: {
          "status.premod": {
            active: false,
            history: [],
          },
        },
      }
    );

    this.log(tenantID).info(
      { matchedCount: result.matchedCount, modifiedCount: result.matchedCount },
      "updated user premod status"
    );
  }
}
