import { Db } from "mongodb";

import { tenants as collection } from "coral-server/services/mongodb/collections";

import { rotateSigningSecret } from "../settings";

export async function rotateExternalModerationPhaseSigningSecret(
  mongo: Db,
  id: string,
  phaseID: string,
  inactiveAt: Date,
  now: Date
) {
  return rotateSigningSecret({
    collection: collection(mongo),
    filter: { id },
    path: "integrations.external.phases",
    id: phaseID,
    prefix: "empsec",
    inactiveAt,
    now,
  });
}
