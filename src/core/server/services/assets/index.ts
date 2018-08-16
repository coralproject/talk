import { Db } from "mongodb";

import {
  findOrCreateAsset,
  FindOrCreateAssetInput,
} from "talk-server/models/asset";
import { Tenant } from "talk-server/models/tenant";
import Task from "talk-server/services/queue/Task";
import { ScraperData } from "talk-server/services/queue/tasks/scraper";

export type FindOrCreateAsset = FindOrCreateAssetInput;

export async function findOrCreate(
  db: Db,
  tenant: Tenant,
  input: FindOrCreateAsset,
  scraper: Task<ScraperData>
) {
  // TODO: check to see if the tenant has enabled lazy asset creation.

  const asset = await findOrCreateAsset(db, tenant.id, input);
  if (!asset) {
    return null;
  }

  if (!asset.scraped) {
    await scraper.add({
      assetID: asset.id,
      assetURL: asset.url,
      tenantID: tenant.id,
    });
  }

  return asset;
}
