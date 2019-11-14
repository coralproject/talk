import { Db } from "mongodb";

import { SSOKey } from "coral-server/models/settings";
import { generateSSOKey } from "coral-server/models/tenant";
import Migration from "coral-server/services/migrate/migration";
import collections from "coral-server/services/mongodb/collections";

import { GQLTime } from "coral-server/graph/tenant/schema/__generated__/types";

import { MigrationError } from "../error";

interface Tenant {
  auth: {
    integrations: {
      sso: {
        key?: string;
        keyGeneratedAt?: GQLTime;
      };
    };
  };
}

export default class extends Migration {
  public async up(mongo: Db, tenantID: string) {
    // Get the Tenant so we can update it. We don't have to worry about two
    // migration operations conflicting here because we will lock one instance
    // to perform the operations.
    const tenant = await collections
      .tenants<Tenant>(mongo)
      .findOne({ id: tenantID });
    if (!tenant) {
      throw new MigrationError(tenantID, "could not find tenant", "tenants", [
        tenantID,
      ]);
    }

    // Store the keys in an array.
    const keys: SSOKey[] = [];

    // Check to see if a key is set.
    const sso = tenant.auth.integrations.sso;
    if (sso.key && sso.keyGeneratedAt) {
      // Create the new SSOKey based on this data.
      const key = generateSSOKey(sso.keyGeneratedAt);

      // Set the secret of the sso key to the secret of the current set key.
      key.secret = sso.key;

      // Add this key to the set of keys.
      keys.push(key);
    }

    // Update the tenant with the new sso keys.
    await collections.tenants(mongo).updateOne(
      { id: tenantID },
      {
        $set: {
          "auth.integrations.sso.keys": keys,
        },
        $unset: {
          "auth.integrations.sso.key": "",
          "auth.integrations.sso.keyGeneratedAt": "",
        },
      }
    );
  }
}
