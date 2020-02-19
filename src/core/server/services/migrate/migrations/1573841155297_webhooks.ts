import { Db } from "mongodb";

import Migration from "coral-server/services/migrate/migration";
import collections from "coral-server/services/mongodb/collections";

import { MigrationError } from "../error";

export default class extends Migration {
  public async up(mongo: Db, id: string) {
    await collections.tenants(mongo).updateOne(
      { id, webhooks: null },
      {
        $set: {
          webhooks: {
            endpoints: [],
          },
        },
      }
    );
  }

  public async test(mongo: Db, id: string) {
    // Ensure that the tenant has the webhooks set.
    const tenant = await collections.tenants(mongo).findOne({ id });
    if (!tenant) {
      throw new MigrationError(
        id,
        "could not find the specified tenant",
        "tenants",
        [id]
      );
    }

    if (!tenant.webhooks) {
      throw new MigrationError(
        id,
        "tenant did not have webhooks set",
        "tenants",
        [id]
      );
    }
  }

  public async down(mongo: Db, id: string) {
    await collections
      .tenants(mongo)
      .updateOne({ id }, { $unset: { webhooks: "" } });
  }
}
