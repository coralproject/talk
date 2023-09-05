import { MongoContext } from "coral-server/data/context";
// Use the following collections reference to interact with specific
// collections.
// import collections from "coral-server/services/mongodb/collections";
import Migration from "coral-server/services/migrate/migration";

export default class extends Migration {
  // Remove the following line once the migration is ready, otherwise the
  // migration will not be ran!
  public static disabled = true;

  public async up(mongo: MongoContext, tenantID: string) {
    throw new Error("migration not implemented");
  }
}
