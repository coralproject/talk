import { Db } from "mongodb";

import collections from "coral-server/services/mongodb/collections";

import Migration from "../migration";

export default class extends Migration {
  public async run(mongo: Db) {
    // Migrate users to include the premod status.
    await collections.users(mongo).updateMany(
      {
        "status.premod": null,
      },
      {
        $set: {
          "status.premod": {
            active: false,
            history: [],
          },
        },
      }
    );
  }
}
