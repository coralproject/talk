import { Db } from "mongodb";

import Migration from "coral-server/services/migrate/migration";
import collections from "coral-server/services/mongodb/collections";

export default class extends Migration {
  public async up(mongo: Db, tenantID: string) {
    await collections.tenants(mongo).updateOne(
      { id: tenantID },
      {
        $rename: {
          "auth.integrations.sso.keys": "auth.integrations.sso.signingSecrets",
        },
      }
    );
  }
}
