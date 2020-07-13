import { isUndefined } from "lodash";
import { Db } from "mongodb";

import Migration from "coral-server/services/migrate/migration";
// Use the following collections reference to interact with specific
// collections.
import collections from "coral-server/services/mongodb/collections";

import { GQLGIPHY_RATING } from "core/client/framework/schema/__generated__/types";

export default class extends Migration {
  public async up(mongo: Db, tenantID: string) {
    const tenant = await collections.tenants(mongo).findOne({ id: tenantID });
    if (tenant && isUndefined(tenant.embeds)) {
      await collections.tenants(mongo).updateOne(
        { id: tenantID },
        {
          $set: {
            embeds: {
              youtube: false,
              giphy: false,
              twitter: false,
              giphyMaxRating: GQLGIPHY_RATING.G,
            },
          },
        }
      );
    }
  }
}
