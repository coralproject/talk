import { Db } from "mongodb";

// Use the following collections reference to interact with specific
// collections.
import collections from "coral-server/services/mongodb/collections";

import Migration from "coral-server/services/migrate/migration";

export default class extends Migration {
  public async up(mongo: Db, tenantID: string) {
    const result = await collections.tenants(mongo).updateOne(
      {
        id: tenantID,
        newCommenters: null,
      },
      {
        $set: {
          newCommenters: {
            premodEnabled: false,
            approvedCommentsThreshold: 2,
          },
        },
      }
    );
    this.log(tenantID).warn(
      {
        matchedCount: result.matchedCount,
        modifiedCount: result.matchedCount,
      },
      "added new commenters config"
    );
  }

  public async down(mongo: Db, tenantID: string) {
    const result = await collections.tenants(mongo).updateOne(
      {
        id: tenantID,
        newCommenters: {
          $exists: true,
        },
      },
      {
        $unset: {
          newCommenters: "",
        },
      }
    );
    this.log(tenantID).warn(
      {
        matchedCount: result.matchedCount,
        modifiedCount: result.matchedCount,
      },
      "removed new commenters config"
    );
  }
}
