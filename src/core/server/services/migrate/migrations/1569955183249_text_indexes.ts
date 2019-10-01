import { Db } from "mongodb";

import Migration from "coral-server/services/migrate/migration";
import collections from "coral-server/services/mongodb/collections";

import { createConnectionOrderVariants, createIndexFactory } from "../indexing";

export default class extends Migration {
  public async indexes(mongo: Db) {
    const createIndex = createIndexFactory(collections.comments(mongo));

    // Text searches.
    await createIndex(
      {
        tenantID: 1,
        "revisions.body": "text",
      },
      { background: true }
    );

    const variants = createConnectionOrderVariants(createIndex, [
      { createdAt: -1 },
      { createdAt: 1 },
      { childCount: -1, createdAt: -1 },
      { "actionCounts.REACTION": -1, createdAt: -1 },
    ]);

    // Story based Comment Connection pagination.
    // { storyID, ...connectionParams }
    await variants({
      tenantID: 1,
      storyID: 1,
    });
  }
}
