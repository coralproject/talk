import { defaults } from "lodash";
import { Db } from "mongodb";
import uuid from "uuid";

import { Omit } from "talk-common/types";
import { dotize } from "talk-common/utils/dotize";
import { ModerationSettings } from "talk-server/models/settings";
import { TenantResource } from "talk-server/models/tenant";

function collection(db: Db) {
  return db.collection<Readonly<Asset>>("assets");
}

export interface Asset extends TenantResource {
  readonly id: string;
  url: string;
  scraped?: Date;
  closedAt?: Date;
  closedMessage?: string;
  title?: string;
  description?: string;
  image?: string;
  section?: string;
  subsection?: string;
  author?: string;
  publication_date?: Date;
  modified_date?: Date;
  created_at: Date;

  /**
   * settings provides a point where the settings can be overriden for a
   * specific Asset.
   */
  settings?: Partial<ModerationSettings>;
}

export interface UpsertAssetInput {
  id?: string;
  url: string;
}

export async function upsertAsset(
  db: Db,
  tenantID: string,
  { id, url }: UpsertAssetInput
) {
  const now = new Date();

  // TODO: verify that the url for the given Asset is whitelisted by the tenant.

  // Create the asset, optionally sourcing the id from the input, additionally
  // porting in the tenant_id.
  const update: { $setOnInsert: Asset } = {
    $setOnInsert: defaults(
      {
        url,
        tenant_id: tenantID,
        created_at: now,
      },
      { id },
      {
        id: uuid.v4(),
      }
    ),
  };

  // Perform the find and update operation to try and find and or create the
  // asset.
  const { value: asset } = await collection(db).findOneAndUpdate(
    { url },
    update,
    {
      // Create the object if it doesn't already exist.
      upsert: true,

      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!asset) {
    return null;
  }

  if (!asset.scraped) {
    // TODO: create scrape job to collect asset metadata
  }

  return asset;
}

export interface FindOrCreateAssetInput {
  id?: string;
  url?: string;
}

export async function findOrCreateAsset(
  db: Db,
  tenantID: string,
  { id, url }: FindOrCreateAssetInput
) {
  if (id) {
    if (url) {
      // The URL was specified, this is an upsert operation.
      return upsertAsset(db, tenantID, {
        id,
        url,
      });
    }

    // The URL was not specified, this is a lookup operation.
    return retrieveAsset(db, tenantID, id);
  }

  // The ID was not specified, this is an upsert operation. Check to see that
  // the URL exists.
  if (!url) {
    throw new Error("cannot upsert an asset without the url");
  }

  return upsertAsset(db, tenantID, { url });
}

export async function retrieveAssetByURL(
  db: Db,
  tenantID: string,
  url: string
) {
  return collection(db).findOne({ url, tenant_id: tenantID });
}

export async function retrieveAsset(db: Db, tenantID: string, id: string) {
  return collection(db).findOne({ id, tenant_id: tenantID });
}

export async function retrieveManyAssets(
  db: Db,
  tenantID: string,
  ids: string[]
) {
  const cursor = await collection(db).find({
    id: { $in: ids },
    tenant_id: tenantID,
  });

  const assets = await cursor.toArray();

  return ids.map(id => assets.find(asset => asset.id === id) || null);
}

export async function retrieveManyAssetsByURL(
  db: Db,
  tenantID: string,
  urls: string[]
) {
  const cursor = await collection(db).find({
    url: { $in: urls },
    tenant_id: tenantID,
  });

  const assets = await cursor.toArray();

  return urls.map(url => assets.find(asset => asset.url === url) || null);
}

export type UpdateAssetInput = Omit<
  Partial<Asset>,
  "id" | "tenant_id" | "url" | "created_at"
>;

export async function updateAsset(
  db: Db,
  tenantID: string,
  id: string,
  input: UpdateAssetInput
) {
  // Only update fields that have been updated.
  const update = {
    $set: {
      ...dotize(input, { embedArrays: true }),
      // Always update the updated at time.
      updated_at: new Date(),
    },
  };

  const result = await collection(db).findOneAndUpdate(
    { id, tenant_id: tenantID },
    update,
    // False to return the updated document instead of the original
    // document.
    { returnOriginal: false }
  );

  return result.value || null;
}
