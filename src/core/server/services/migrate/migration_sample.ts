import { Db } from "mongodb";

// Use the following collections reference to interact with specific
// collections.
// import collections from "coral-server/services/mongodb/collections";

import Migration from "coral-server/services/migrate/migration";

export default class extends Migration {
  public async up(mongo: Db, tenantID: string) {
    throw new Error("migration not implemented");
  }
}
