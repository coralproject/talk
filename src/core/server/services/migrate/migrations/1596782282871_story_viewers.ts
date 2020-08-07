import { Db } from "mongodb";

import Migration from "coral-server/services/migrate/migration";
import collections from "coral-server/services/mongodb/collections";

import { createIndexFactory } from "../indexing";

export default class extends Migration {
  // Remove the following line once the migration is ready, otherwise the
  // migration will not be ran!
  public static disabled = true;

  public async indexes(mongo: Db) {
    const indexer = createIndexFactory(collections.storyViewer(mongo));

    await indexer({ storyID: 1 });
    await indexer({ clientID: 1 }, { unique: true });
    await indexer({ lastInteractedAt: 1 }, { expireAfterSeconds: 30 * 60 });
  }
}
