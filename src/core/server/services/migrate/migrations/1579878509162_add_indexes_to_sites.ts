import { Db } from "mongodb";

// Use the following collections reference to interact with specific
// collections.
import collections from "coral-server/services/mongodb/collections";

import Migration from "coral-server/services/migrate/migration";
import { createIndexFactory } from "../indexing";

export default class extends Migration {
  public async indexes(mongo: Db) {
    const createIndex = createIndexFactory(collections.sites(mongo));
    await createIndex({ tenantID: 1, id: 1 }, { background: true });
    await createIndex({ tenantID: 1, allowedOrigins: 1 }, { unique: true });
    await createIndex({ tenantID: 1, name: 1 }, { background: true });
  }
}
