import { Db } from "mongodb";

import { Settings } from "coral-server/models/settings";
import { Tenant } from "coral-server/models/tenant";
import Migration from "coral-server/services/migrate/migration";
import collections from "coral-server/services/mongodb/collections";

// Use the following collections reference to interact with specific
// collections.
import { MigrationError } from "../error";

type LegacyTenant = Tenant & {
  allowedDomains: string[];
  settings: Settings;
};

export default class extends Migration {
  private async getTenant(mongo: Db, id: string): Promise<LegacyTenant> {
    const tenant = await collections.tenants(mongo).findOne({ id });
    if (!tenant) {
      throw new MigrationError(id, "tenant not found", "tenants", [id]);
    }

    return tenant as LegacyTenant;
  }

  public async test(mongo: Db, id: string) {
    const tenant = await this.getTenant(mongo, id);
    if (!tenant.settings) {
      throw new MigrationError(id, "settings not set", "tenants", [id]);
    }
  }

  public async up(mongo: Db, id: string) {
    const tenant: LegacyTenant = await this.getTenant(mongo, id);
    const domains = tenant.allowedDomains;

    await collections.tenants(mongo).updateOne(
      { id },
      {
        $set: {
          domains,
        },
      }
    );
  }
}
