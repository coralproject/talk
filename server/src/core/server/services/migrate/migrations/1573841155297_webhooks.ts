import { MongoContext } from "coral-server/data/context";
import Migration from "coral-server/services/migrate/migration";

import { MigrationError } from "../error";

export default class extends Migration {
  public async up(mongo: MongoContext, id: string) {
    await mongo.tenants().updateOne(
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

  public async test(mongo: MongoContext, id: string) {
    // Ensure that the tenant has the webhooks set.
    const tenant = await mongo.tenants().findOne({ id });
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

  public async down(mongo: MongoContext, id: string) {
    await mongo.tenants().updateOne({ id }, { $unset: { webhooks: "" } });
  }
}
