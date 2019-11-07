import { Db } from "mongodb";

import Migration from "coral-server/services/migrate/migration";
import collections from "coral-server/services/mongodb/collections";

import { createIndex } from "../indexing";

export default class extends Migration {
  public async indexes(mongo: Db) {
    // Drop the old index.
    await collections
      .users(mongo)
      .dropIndex("tenantID_1_profiles.type_1_profiles.id_1");

    // Clean up the old users that have deleted their accounts.
    await collections
      .users(mongo)
      .updateMany({ profiles: [] }, { $unset: { profiles: "" } });

    // Add the new index.
    await createIndex(
      collections.users(mongo),
      {
        tenantID: 1,
        "profiles.id": 1,
        "profiles.type": 1,
      },
      {
        unique: true,
        partialFilterExpression: { profiles: { $exists: true } },
      }
    );
  }
}
