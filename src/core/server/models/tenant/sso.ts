import { Db } from "mongodb";

import { rotateSigningSecret } from "coral-server/models/settings";
import { tenants as collection } from "coral-server/services/mongodb/collections";

export async function rotateTenantSSOSigningSecret(
  mongo: Db,
  id: string,
  inactiveAt: Date,
  now: Date
) {
  return rotateSigningSecret({
    collection: collection(mongo),
    filter: { id },
    path: "auth.integrations.sso",
    prefix: "ssosec",
    inactiveAt,
    now,
  });
}

export async function deactivateTenantSSOSigningSecret(
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

export async function deleteTenantSSOSigningSecret(
  mongo: Db,
  id: string,
  kid: string
) {
  // Update the tenant.
  const result = await collection(mongo).findOneAndUpdate(
    { id },
    {
      $pull: {
        "auth.integrations.sso.keys": { kid },
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );

  return result.value || null;
}
