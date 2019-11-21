import { Db } from "mongodb";

import Migration from "coral-server/services/migrate/migration";
import collections from "coral-server/services/mongodb/collections";

import { createIndex } from "../indexing";

export default class extends Migration {
  public async indexes(mongo: Db) {
    await createIndex(
      collections.users(mongo),
      {
        tenantID: 1,
        scheduledDeletionDate: 1,
      },
      {
        partialFilterExpression: { scheduledDeletionDate: { $exists: true } },
        background: true,
      }
    );
  }
}
