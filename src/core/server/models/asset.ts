import { Db } from "mongodb";
import uuid from "uuid";

import { Omit } from "talk-common/types";
import { dotize } from "talk-common/utils/dotize";
import { GQLCOMMENT_STATUS } from "talk-server/graph/tenant/schema/__generated__/types";
import { EncodedActionCounts } from "talk-server/models/action";
import { ModerationSettings } from "talk-server/models/settings";
import { TenantResource } from "talk-server/models/tenant";

function collection(db: Db) {
  return db.collection<Readonly<Asset>>("assets");
}

// TODO: (wyattjoh) write a test to verify that this set of counts is always in sync with GQLCOMMENT_STATUS.
export interface CommentStatusCounts {
  [GQLCOMMENT_STATUS.ACCEPTED]: number;
  [GQLCOMMENT_STATUS.NONE]: number;
  [GQLCOMMENT_STATUS.PREMOD]: number;
  [GQLCOMMENT_STATUS.REJECTED]: number;
  [GQLCOMMENT_STATUS.SYSTEM_WITHHELD]: number;
}

export interface Asset extends TenantResource {
  readonly id: string;
  url: string;
  scraped?: Date;
  closedAt?: Date;
  closedMessage?: string;
  created_at: Date;
  modified_date?: Date;

  title?: string;
  description?: string;
  image?: string;
  section?: string;
  subsection?: string;
  author?: string;
  publication_date?: Date;

  /**
   * action_counts stores all the action counts for all Comment's on this Asset.
   */
  action_counts: EncodedActionCounts;

  /**
   * comment_counts stores the different counts for each comment on the Asset
   * according to their statuses.
   */
  comment_counts: CommentStatusCounts;

  /**
   * settings provides a point where the settings can be overridden for a
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
    $setOnInsert: {
      id: id ? id : uuid.v4(),
      url,
      tenant_id: tenantID,
      created_at: now,
      action_counts: {},
      comment_counts: createEmptyCommentCounts(),
    },
  };

  // Perform the find and update operation to try and find and or create the
  // asset.
  const { value: asset } = await collection(db).findOneAndUpdate(
    {
      url,
      tenant_id: tenantID,
    },
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

/**
 * updateCommentStatusCount increments the number of status counts for the
 * given Asset ID.
 *
 * @param mongo the database handle
 * @param tenantID the tenant that the Asset is on.
 * @param id the ID of the Asset.
 * @param commentStatusCounts the update document that contains a positive or
 *  negative number of comments to increment on the given Asset.
 */
export async function updateCommentStatusCount(
  mongo: Db,
  tenantID: string,
  id: string,
  commentStatusCounts: Partial<CommentStatusCounts>
) {
  const { value: asset } = await collection(mongo).findOneAndUpdate(
    {
      id,
      tenant_id: tenantID,
    },
    // Update all the specific comment status counts that are associated with
    // each of the counts.
    { $inc: dotize({ comment_counts: commentStatusCounts }) },
    // False to return the updated document instead of the original
    // document.
    { returnOriginal: false }
  );

  return asset;
}

function createEmptyCommentCounts(): CommentStatusCounts {
  return {
    [GQLCOMMENT_STATUS.ACCEPTED]: 0,
    [GQLCOMMENT_STATUS.NONE]: 0,
    [GQLCOMMENT_STATUS.PREMOD]: 0,
    [GQLCOMMENT_STATUS.REJECTED]: 0,
    [GQLCOMMENT_STATUS.SYSTEM_WITHHELD]: 0,
  };
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

/**
 * updateAssetActionCounts will update the given comment's action counts on
 * the Asset.
 *
 * @param mongo the database handle
 * @param tenantID the id of the Tenant
 * @param id the id of the Asset being updated
 * @param actionCounts the action counts to merge into the Asset
 */
export async function updateAssetActionCounts(
  mongo: Db,
  tenantID: string,
  id: string,
  actionCounts: EncodedActionCounts
) {
  const result = await collection(mongo).findOneAndUpdate(
    { id, tenant_id: tenantID },
    // Update all the specific action counts that are associated with each of
    // the counts.
    { $inc: dotize({ action_counts: actionCounts }) },
    // False to return the updated document instead of the original
    // document.
    { returnOriginal: false }
  );

  return result.value;
}
