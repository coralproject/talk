import { Db } from "mongodb";

import Migration from "coral-server/services/migrate/migration";
import collections from "coral-server/services/mongodb/collections";

export default class extends Migration {
  public async up(mongo: Db, id: string) {
    const sites = await collections
      .sites(mongo)
      .find({ tenantID: id })
      .toArray();
    if (sites.length === 1) {
      await collections.stories(mongo).updateMany(
        { tenantID: id },
        {
          $set: {
            siteID: sites[0].id,
          },
        }
      );
    }
  }
}
