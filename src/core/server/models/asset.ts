import { Db, Collection } from "mongodb";
import Query, { FilterQuery } from "./query";
import { defaults } from "lodash";
import uuid from "uuid";
import { Omit } from "talk-common/types";
import dotize from "dotize";
import { TenantResource } from "talk-server/models/tenant";

function collection(db: Db): Collection<Asset> {
  return db.collection<Asset>("assets");
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
}

export type CreateAssetInput = Pick<Asset, "id" | "url">;

export async function create(
  db: Db,
  tenantID: string,
  input: CreateAssetInput
): Promise<Asset> {
  const now = new Date();

  // Construct the filter.
  const query = new Query<Asset>(collection(db)).where({
    tenant_id: tenantID,
  });
  if (input.id) {
    query.where({ id: input.id });
  } else {
    query.where({ url: input.url });
  }

  // Craft the update object.
  const update: { $setOnInsert: Asset } = {
    $setOnInsert: defaults(input, {
      id: uuid.v4(),
      tenant_id: tenantID,
      created_at: now,
    }),
  };

  // Perform the upsert operation.
  const result = await db
    .collection<Asset>("assets")
    .findOneAndUpdate(query.filter, update, {
      // Create the object if it doesn't already exist.
      upsert: true,
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    });

  return result.value;
}

export async function retrieve(
  db: Db,
  tenantID: string,
  id: string
): Promise<Asset> {
  return await db
    .collection<Asset>("assets")
    .findOne({ id, tenant_id: tenantID });
}

export async function retrieveMany(
  db: Db,
  tenantID: string,
  ids: string[]
): Promise<Array<Asset>> {
  const cursor = await db
    .collection<Asset>("assets")
    .find({ id: { $in: ids }, tenant_id: tenantID });

  const assets = await cursor.toArray();

  return ids.map(id => assets.find(asset => asset.id === id));
}

export type UpdateAssetInput = Omit<
  Partial<Asset>,
  "id" | "tenant_id" | "url" | "created_at"
>;

export async function update(
  db: Db,
  tenantID: string,
  id: string,
  update: UpdateAssetInput
): Promise<Readonly<Asset>> {
  const result = await db.collection<Asset>("assets").findOneAndUpdate(
    { id, tenant_id: tenantID },
    // Only update fields that have been updated.
    { $set: dotize(update) },
    // False to return the updated document instead of the original
    // document.
    { returnOriginal: false }
  );

  return result.value;
}
