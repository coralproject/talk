import { Db } from "mongodb";

import Migration from "coral-server/services/migrate/migration";
import collections from "coral-server/services/mongodb/collections";

export default class extends Migration {
  public async up(mongo: Db, tenantID: string) {
    const result = await collections.users(mongo).updateMany(
      { tenantID, commentCounts: null },
      {
        $set: {
          commentCounts: {
            status: {
              APPROVED: 0,
              NONE: 0,
              PREMOD: 0,
              REJECTED: 0,
              SYSTEM_WITHHELD: 0,
            },
          },
        },
      }
    );

    this.log(tenantID).warn(
      {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      },
      "applied fix to users"
    );
  }
}
