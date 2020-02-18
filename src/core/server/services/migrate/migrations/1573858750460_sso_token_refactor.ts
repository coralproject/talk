import { DateTime } from "luxon";
import { Db } from "mongodb";

import { Secret } from "coral-server/models/settings";
import Migration from "coral-server/services/migrate/migration";
import collections from "coral-server/services/mongodb/collections";

import { MigrationError } from "../error";

interface OldSSOKey {
  kid: string;
  secret?: string;
  createdAt: Date;
  deprecateAt?: Date;
  deletedAt?: Date;
}

function isOldSSOKey(key: Secret | OldSSOKey): key is OldSSOKey {
  if (!key) {
    return true;
  }

  if ((key as Secret).inactiveAt) {
    return false;
  }

  if ((key as Secret).rotatedAt) {
    return false;
  }

  if (key.secret === "<deleted>") {
    return false;
  }

  if ((key as OldSSOKey).deprecateAt) {
    return true;
  }

  if ((key as OldSSOKey).deletedAt) {
    return true;
  }

  return false;
}

interface OldTenant {
  auth: {
    integrations: {
      sso: {
        keys: OldSSOKey[];
      };
    };
  };
}

export default class extends Migration {
  public async down(mongo: Db, id: string) {
    // Get the Tenant that stores the keys in the old format.
    const tenant = await collections.tenants(mongo).findOne({ id });
    if (!tenant) {
      throw new MigrationError(id, "tenant was not found", "tenants", [id]);
    }

    // Transform the keys into the new format.
    const keys: OldSSOKey[] = tenant.auth.integrations.sso.keys.map(
      (key: OldSSOKey | Secret): OldSSOKey =>
        !isOldSSOKey(key)
          ? {
              kid: key.kid,
              secret: key.secret === "<deleted>" ? undefined : key.secret,
              createdAt: key.createdAt,
              deprecateAt: key.inactiveAt,
            }
          : key
    );

    // Update the key to the new format.
    await collections
      .tenants<OldTenant>(mongo)
      .updateOne({ id }, { $set: { "auth.integrations.sso.keys": keys } });
  }

  public async test(mongo: Db, id: string) {
    // Get the Tenant that stores the keys in the old format.
    const tenant = await collections.tenants<OldTenant>(mongo).findOne({ id });
    if (!tenant) {
      throw new MigrationError(id, "tenant was not found", "tenants", [id]);
    }

    if (tenant.auth.integrations.sso.keys.some(key => isOldSSOKey(key))) {
      throw new MigrationError(id, "old sso key was found", "tenants", [id]);
    }
  }

  public async up(mongo: Db, id: string) {
    // Get the Tenant that stores the keys in the old format.
    const tenant = await collections.tenants<OldTenant>(mongo).findOne({ id });
    if (!tenant) {
      throw new MigrationError(id, "tenant was not found", "tenants", [id]);
    }

    // Transform the keys into the new format.
    const keys: Secret[] = tenant.auth.integrations.sso.keys.map(
      (key): Secret => ({
        kid: key.kid,
        secret: key.secret || "<deleted>",
        createdAt: key.createdAt,
        inactiveAt: key.deprecateAt,
        rotatedAt: key.deprecateAt
          ? DateTime.fromJSDate(key.deprecateAt)
              .plus({ month: -1 })
              .toJSDate()
          : undefined,
      })
    );

    // Update the key to the new format.
    await collections
      .tenants(mongo)
      .updateOne({ id }, { $set: { "auth.integrations.sso.keys": keys } });
  }
}
