import { MongoContext } from "coral-server/data/context";
import { rotateSigningSecret } from "coral-server/models/settings";

export async function rotateTenantSSOSigningSecret(
  mongo: MongoContext,
  id: string,
  inactiveAt: Date,
  now: Date
) {
  return rotateSigningSecret({
    collection: mongo.tenants(),
    filter: { id },
    path: "auth.integrations.sso",
    prefix: "ssosec",
    inactiveAt,
    now,
  });
}

export async function deactivateTenantSSOSigningSecret(
  mongo: MongoContext,
  id: string,
  kid: string,
  inactiveAt: Date,
  now: Date
) {
  // Update the tenant.
  const result = await mongo.tenants().findOneAndUpdate(
    { id },
    {
      $set: {
        "auth.integrations.sso.signingSecrets.$[signingSecrets].inactiveAt":
          inactiveAt,
        "auth.integrations.sso.signingSecrets.$[signingSecrets].rotatedAt": now,
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
      // Add an ArrayFilter to only update one of the keys.
      arrayFilters: [{ "signingSecrets.kid": kid }],
    }
  );
  if (!result.value) {
    throw new Error("tenant not found with id");
  }

  return result.value;
}

export async function deleteTenantSSOSigningSecret(
  mongo: MongoContext,
  id: string,
  kid: string
) {
  // Update the tenant.
  const result = await mongo.tenants().findOneAndUpdate(
    { id },
    {
      $pull: {
        "auth.integrations.sso.signingSecrets": { kid },
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    throw new Error("tenant not found with id");
  }

  return result.value;
}
