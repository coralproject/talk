import { Db } from "mongodb";

import Migration from "coral-server/services/migrate/migration";
import collections from "coral-server/services/mongodb/collections";

import { createIndex } from "../indexing";

export default class extends Migration {
  public async up(mongo: Db, tenantID: string) {
    const result = await collections.users(mongo).updateMany(
      {
        tenantID,
        digests: {
          $ne: [],
        },
      },
      {
        $set: {
          hasDigests: true,
        },
      }
    );
    this.log(tenantID).warn(
      {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      },
      "added hasDigests flag"
    );
  }

  public async indexes(mongo: Db) {
    await createIndex(
      collections.users(mongo),
      {
        tenantID: 1,
        "notifications.digestFrequency": 1,
        hasDigests: 1,
      },
      {
        partialFilterExpression: { hasDigests: { $eq: true } },
        background: true,
      }
    );
  }
}
