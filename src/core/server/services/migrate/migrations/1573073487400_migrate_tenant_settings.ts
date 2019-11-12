import { pick } from "lodash";
import { Db } from "mongodb";

import Migration from "coral-server/services/migrate/migration";
import collections from "coral-server/services/mongodb/collections";

// Use the following collections reference to interact with specific
// collections.
import { MigrationError } from "../error";

export default class extends Migration {
  private async getTenant(mongo: Db, id: string) {
    const tenant = await collections.tenants(mongo).findOne({ id });
    if (!tenant) {
      throw new MigrationError(id, "tenant not found", "tenants", [id]);
    }

    return tenant;
  }

  public async test(mongo: Db, id: string) {
    const tenant = await this.getTenant(mongo, id);
    if (!tenant.settings) {
      throw new MigrationError(id, "settings not set", "tenants", [id]);
    }
  }

  public async up(mongo: Db, id: string) {
    const tenant = await this.getTenant(mongo, id);
    const settings = pick(tenant, [
      "charCount",
      "email",
      "recentCommentHistory",
      "wordList",
      "integrations",
      "reaction",
      "staff",
      "editCommentWindowLength",
      "customCSSURL",
      "communityGuidelines",
      "stories",
      "auth",
      "email",
      "closeCommenting",
      "disableCommenting",
      "accountFeatures",
      "locale",
      "live",
    ]);

    await collections.tenants(mongo).updateOne(
      { id },
      {
        $set: {
          settings,
        },
      }
    );
  }
}
