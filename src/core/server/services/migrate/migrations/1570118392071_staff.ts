import { Db } from "mongodb";

import { Omit } from "coral-common/types";
import { Settings } from "coral-server/models/settings";
import {
  getDefaultStaffConfiguration,
  Tenant,
} from "coral-server/models/tenant";
import Migration from "coral-server/services/migrate/migration";
import collections from "coral-server/services/mongodb/collections";

import { MigrationError } from "../error";

interface LegacyTenant extends Omit<Tenant, "ownSettings"> {
  settings: Settings;
}

export default class extends Migration {
  private async getTenant(mongo: Db, id: string): Promise<LegacyTenant> {
    const tenant: LegacyTenant | null = await collections
      .tenants(mongo)
      .findOne({ id });
    if (!tenant) {
      throw new MigrationError(id, "tenant not found", "tenants", [id]);
    }

    return tenant;
  }

  public async test(mongo: Db, id: string) {
    const tenant = await this.getTenant(mongo, id);
    if (!tenant.settings.staff) {
      throw new MigrationError(id, "staff not set", "tenants", [id]);
    }
  }

  public async up(mongo: Db, id: string) {
    const tenant = await this.getTenant(mongo, id);
    const bundle = this.i18n.getBundle(tenant.locale);
    await collections.tenants(mongo).updateOne(
      { id, staff: null },
      {
        $set: {
          staff: getDefaultStaffConfiguration(bundle),
        },
      }
    );
  }
}
