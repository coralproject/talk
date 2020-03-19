import { Db } from "mongodb";

import { generateSecret, rollSecret } from "coral-server/models/settings";
import { tenants as collection } from "coral-server/services/mongodb/collections";

export async function rollTenantSSOSecret(
  mongo: Db,
  id: string,
  inactiveAt: Date,
  now: Date
) {
  return rollSecret({
    collection: collection(mongo),
    filter: { id },
    path: "auth.integrations.sso",
    prefix: "ssosec",
    inactiveAt,
    now,
  });
}

export async function createTenantSSOKey(mongo: Db, id: string, now: Date) {
  // Construct the new key.
  const key = generateSecret("ssosec", now);

  // Update the Tenant with this new key.
  const result = await collection(mongo).findOneAndUpdate(
    { id },
    {
      $push: {
        "auth.integrations.sso.keys": key,
      },
    },
    // False to return the updated document instead of the original
    // document.
    { returnOriginal: false }
  );

  return result.value || null;
}

export async function deactivateTenantSSOKey(
  mongo: Db,
  id: string,
  kid: string,
  inactiveAt: Date,
  now: Date
) {
  // Update the tenant.
  const result = await collection(mongo).findOneAndUpdate(
    { id },
    {
      $set: {
        "auth.integrations.sso.keys.$[keys].inactiveAt": inactiveAt,
        "auth.integrations.sso.keys.$[keys].rotatedAt": now,
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
      // Add an ArrayFilter to only update one of the keys.
      arrayFilters: [{ "keys.kid": kid }],
    }
  );

  return result.value || null;
}
