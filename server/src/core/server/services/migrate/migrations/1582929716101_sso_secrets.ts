import { MongoContext } from "coral-server/data/context";
import Migration from "coral-server/services/migrate/migration";

export default class extends Migration {
  public async up(mongo: MongoContext, tenantID: string) {
    await mongo.tenants().updateOne(
      { id: tenantID },
      {
        $rename: {
          "auth.integrations.sso.keys": "auth.integrations.sso.signingSecrets",
        },
      }
    );
  }
}
