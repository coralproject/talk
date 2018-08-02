import { Db } from "mongodb";

import {
  findOrCreateAsset,
  FindOrCreateAssetInput,
} from "talk-server/models/asset";
import { Tenant } from "talk-server/models/tenant";

export type FindOrCreateAsset = FindOrCreateAssetInput;

export async function findOrCreate(
  db: Db,
  tenant: Tenant,
  input: FindOrCreateAsset
) {
  // TODO: check to see if the tenant has enabled lazy asset creation.

  const asset = await findOrCreateAsset(db, tenant.id, input);

  return asset;
}
