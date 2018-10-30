import { Db } from "mongodb";
import uuid from "uuid";

import { Omit } from "talk-common/types";
import { dotize } from "talk-common/utils/dotize";
import {
  GQLCOMMENT_STATUS,
  GQLStoryMetadata,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { EncodedActionCounts } from "talk-server/models/action";
import { ModerationSettings } from "talk-server/models/settings";
import { TenantResource } from "talk-server/models/tenant";

function collection(db: Db) {
  return db.collection<Readonly<Story>>("stories");
}

// TODO: (wyattjoh) write a test to verify that this set of counts is always in sync with GQLCOMMENT_STATUS.
export interface CommentStatusCounts {
  [GQLCOMMENT_STATUS.ACCEPTED]: number;
  [GQLCOMMENT_STATUS.NONE]: number;
  [GQLCOMMENT_STATUS.PREMOD]: number;
  [GQLCOMMENT_STATUS.REJECTED]: number;
  [GQLCOMMENT_STATUS.SYSTEM_WITHHELD]: number;
}

export interface Story extends TenantResource {
  readonly id: string;

  /**
   * url is the URL to the Story page.
   */
  url: string;

  /**
   * metadata stores the scraped metadata from the Story page.
   */
  metadata?: GQLStoryMetadata;

  /**
   * scrapedAt is the Time that the Story had it's metadata scraped at.
   */
  scrapedAt?: Date;

  /**
   * action_counts stores all the action counts for all Comment's on this Story.
   */
  action_counts: EncodedActionCounts;

  /**
   * comment_counts stores the different counts for each comment on the Story
   * according to their statuses.
   */
  comment_counts: CommentStatusCounts;

  /**
   * settings provides a point where the settings can be overridden for a
   * specific Story.
   */
  settings?: Partial<ModerationSettings>;

  /**
   * closedAt is the date that the Story was forced closed at.
   */
  closedAt?: Date;

  closedMessage?: string;

  /**
   * created_at is the date that the Story was added to the Talk database.
   */
  created_at: Date;
}

export interface UpsertStoryInput {
  id?: string;
  url: string;
}

export async function upsertStory(
  db: Db,
  tenantID: string,
  { id, url }: UpsertStoryInput
) {
  const now = new Date();

  // Create the story, optionally sourcing the id from the input, additionally
  // porting in the tenant_id.
  const update: { $setOnInsert: Story } = {
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
  // story.
  const result = await collection(db).findOneAndUpdate(
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

  return result.value || null;
}

/**
 * updateCommentStatusCount increments the number of status counts for the
 * given Story ID.
 *
 * @param mongo the database handle
 * @param tenantID the tenant that the Story is on.
 * @param id the ID of the Story.
 * @param commentStatusCounts the update document that contains a positive or
 *  negative number of comments to increment on the given Story.
 */
export async function updateCommentStatusCount(
  mongo: Db,
  tenantID: string,
  id: string,
  commentStatusCounts: Partial<CommentStatusCounts>
) {
  const result = await collection(mongo).findOneAndUpdate(
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

  return result.value || null;
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

export interface FindOrCreateStoryInput {
  id?: string;
  url?: string;
}

export async function findOrCreateStory(
  db: Db,
  tenantID: string,
  { id, url }: FindOrCreateStoryInput
) {
  if (id) {
    if (url) {
      // The URL was specified, this is an upsert operation.
      return upsertStory(db, tenantID, {
        id,
        url,
      });
    }

    // The URL was not specified, this is a lookup operation.
    return retrieveStory(db, tenantID, id);
  }

  // The ID was not specified, this is an upsert operation. Check to see that
  // the URL exists.
  if (!url) {
    throw new Error("cannot upsert an story without the url");
  }

  return upsertStory(db, tenantID, { url });
}

export async function retrieveStoryByURL(
  db: Db,
  tenantID: string,
  url: string
) {
  return collection(db).findOne({ url, tenant_id: tenantID });
}

export async function retrieveStory(db: Db, tenantID: string, id: string) {
  return collection(db).findOne({ id, tenant_id: tenantID });
}

export async function retrieveManyStories(
  db: Db,
  tenantID: string,
  ids: string[]
) {
  const cursor = await collection(db).find({
    id: { $in: ids },
    tenant_id: tenantID,
  });

  const stories = await cursor.toArray();

  return ids.map(id => stories.find(story => story.id === id) || null);
}

export async function retrieveManyStoriesByURL(
  db: Db,
  tenantID: string,
  urls: string[]
) {
  const cursor = await collection(db).find({
    url: { $in: urls },
    tenant_id: tenantID,
  });

  const stories = await cursor.toArray();

  return urls.map(url => stories.find(story => story.url === url) || null);
}

export type UpdateStoryInput = Omit<
  Partial<Story>,
  "id" | "tenant_id" | "url" | "created_at"
>;

export async function updateStory(
  db: Db,
  tenantID: string,
  id: string,
  input: UpdateStoryInput
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
 * updateStoryActionCounts will update the given comment's action counts on
 * the Story.
 *
 * @param mongo the database handle
 * @param tenantID the id of the Tenant
 * @param id the id of the Story being updated
 * @param actionCounts the action counts to merge into the Story
 */
export async function updateStoryActionCounts(
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

  return result.value || null;
}
