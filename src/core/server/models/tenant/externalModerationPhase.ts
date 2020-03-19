import { Db } from "mongodb";

import { tenants as collection } from "coral-server/services/mongodb/collections";

import { rollSecret } from "../settings";

export async function rollExternalModerationPhaseSecret(
  mongo: Db,
  id: string,
  phaseID: string,
  inactiveAt: Date,
  now: Date
) {
  return rollSecret({
    collection: collection(mongo),
    filter: { id },
    path: "integrations.external.phases",
    id: phaseID,
    prefix: "empsec",
    inactiveAt,
    now,
  });
}
