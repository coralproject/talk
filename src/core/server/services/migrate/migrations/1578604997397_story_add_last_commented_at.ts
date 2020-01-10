import { Db } from "mongodb";

import Migration from "coral-server/services/migrate/migration";
import collections from "coral-server/services/mongodb/collections";

import { createIndexFactory } from "../indexing";

export default class extends Migration {
  public async indexes(mongo: Db) {
    const createIndex = createIndexFactory(collections.stories(mongo));

    // Create a partial sparse index on lastCommentedAt:
    //   tenantID: 1 <- ASC tenantIDs
    //   lastCommentedAt: -1 <- DESC dates (more recent to latest)
    //   ^ explained here: https://docs.mongodb.com/manual/core/index-compound/#sort-order
    await createIndex(
      { tenantID: 1, lastCommentedAt: -1 },
      { partialFilterExpression: { lastCommentedAt: { $exists: true } } }
    );
  }
}
