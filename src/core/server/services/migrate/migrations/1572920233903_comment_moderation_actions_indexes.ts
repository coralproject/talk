import { Db } from "mongodb";

import Migration from "coral-server/services/migrate/migration";
import collections from "coral-server/services/mongodb/collections";

import { createIndexFactory } from "../indexing";

export default class extends Migration {
  public async indexes(mongo: Db) {
    const createIndex = createIndexFactory(
      collections.commentModerationActions(mongo)
    );

    await createIndex(
      { tenantID: 1, commentID: 1, createdAt: -1 },
      { background: true }
    );
  }
}
