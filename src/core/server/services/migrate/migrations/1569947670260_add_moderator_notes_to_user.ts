import { Db } from "mongodb";

import collections from "coral-server/services/mongodb/collections";

import Migration from "coral-server/services/migrate/migration";

export default class extends Migration {
  public async up(mongo: Db, tenantID: string) {
    const result = await collections.users(mongo).updateMany(
      {
        tenantID,
        moderatorNotes: null,
      },
      {
        $set: {
          moderatorNotes: [],
        },
      }
    );
    this.log(tenantID).warn(
      {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      },
      "added empty moderatorNotes array"
    );
  }

  public async down(mongo: Db, tenantID: string) {
    const result = await collections.users(mongo).updateMany(
      {
        tenantID,
        moderatorNotes: {
          $exists: true,
        },
      },
      {
        $unset: {
          moderatorNotes: "",
        },
      }
    );
    this.log(tenantID).warn(
      {
        matchedCount: result.matchedCount,
        modifiedCount: result.matchedCount,
      },
      "removed moderatorNotes"
    );
  }
}
