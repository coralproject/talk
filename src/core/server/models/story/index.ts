import { Db, MongoError } from "mongodb";
import uuid from "uuid";

import { Omit } from "talk-common/types";
import { dotize } from "talk-common/utils/dotize";
import { DuplicateStoryURLError } from "talk-server/errors";
import { GQLStoryMetadata } from "talk-server/graph/tenant/schema/__generated__/types";
import { createIndexFactory } from "talk-server/models/helpers/query";
import { ModerationSettings } from "talk-server/models/settings";
import { TenantResource } from "talk-server/models/tenant";

import {
  createEmptyCommentModerationQueueCounts,
  createEmptyCommentStatusCounts,
  StoryCommentCounts,
} from "./counts";

// Export everything under counts.
export * from "./counts";

function collection<T = Story>(db: Db) {
  return db.collection<Readonly<T>>("stories");
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
   * commentCounts stores all the comment counters.
   */
  commentCounts: StoryCommentCounts;

  /**
   * settings provides a point where the settings can be overridden for a
   * specific Story.
   */
  settings?: Partial<ModerationSettings>;

  /**
   * closedAt is the date that the Story was forced closed at, or false to
   * indicate that the story was re-opened.
   */
  closedAt?: Date | false;

  /**
   * createdAt is the date that the Story was added to the Talk database.
   */
  createdAt: Date;
}

export async function createStoryIndexes(mongo: Db) {
  const createIndex = createIndexFactory(collection(mongo));

  // UNIQUE { id }
  await createIndex({ tenantID: 1, id: 1 }, { unique: true });

  // UNIQUE { url }
  await createIndex({ tenantID: 1, url: 1 }, { unique: true });
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
  // porting in the tenantID.
  const update: { $setOnInsert: Story } = {
    $setOnInsert: {
      id: id ? id : uuid.v4(),
      url,
      tenantID,
      createdAt: now,
      commentCounts: {
        action: {},
        status: createEmptyCommentStatusCounts(),
        moderationQueue: createEmptyCommentModerationQueueCounts(),
      },
    },
  };

  // Perform the find and update operation to try and find and or create the
  // story.
  const result = await collection(db).findOneAndUpdate(
    {
      url,
      tenantID,
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

export type CreateStoryInput = Partial<Pick<Story, "metadata">>;

export async function createStory(
  mongo: Db,
  tenantID: string,
  id: string,
  url: string,
  input: CreateStoryInput
) {
  const now = new Date();

  // Create the story.
  const story: Story = {
    ...input,
    id,
    url,
    tenantID,
    createdAt: now,
    commentCounts: {
      action: {},
      moderationQueue: createEmptyCommentModerationQueueCounts(),
      status: createEmptyCommentStatusCounts(),
    },
  };

  try {
    // Insert the story into the database.
    await collection(mongo).insertOne(story);
  } catch (err) {
    // Evaluate the error, if it is in regards to violating the unique index,
    // then return a duplicate Story error.
    if (err instanceof MongoError && err.code === 11000) {
      throw new DuplicateStoryURLError(url);
    }

    throw err;
  }

  // Return the created story.
  return story;
}

export async function retrieveStoryByURL(
  db: Db,
  tenantID: string,
  url: string
) {
  return collection(db).findOne({ url, tenantID });
}

export async function retrieveStory(db: Db, tenantID: string, id: string) {
  return collection(db).findOne({ id, tenantID });
}

export async function retrieveManyStories(
  db: Db,
  tenantID: string,
  ids: string[]
) {
  const cursor = await collection(db).find({
    id: { $in: ids },
    tenantID,
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
    tenantID,
  });

  const stories = await cursor.toArray();

  return urls.map(url => stories.find(story => story.url === url) || null);
}

export type UpdateStoryInput = Omit<
  Partial<Story>,
  "id" | "tenantID" | "createdAt"
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
      updatedAt: new Date(),
    },
  };

  try {
    const result = await collection(db).findOneAndUpdate(
      { id, tenantID },
      update,
      // False to return the updated document instead of the original
      // document.
      { returnOriginal: false }
    );

    return result.value || null;
  } catch (err) {
    // Evaluate the error, if it is in regards to violating the unique index,
    // then return a duplicate Story error.
    if (input.url && err instanceof MongoError && err.code === 11000) {
      // TODO: (wyattjoh) return better error
      throw new Error("story with this url already exists");
    }

    throw err;
  }
}

export async function removeStory(mongo: Db, tenantID: string, id: string) {
  const result = await collection(mongo).findOneAndDelete({
    id,
    tenantID,
  });

  return result.value || null;
}

/**
 * removeStories will remove the stories specified by the set of id's.
 */
export async function removeStories(
  mongo: Db,
  tenantID: string,
  ids: string[]
) {
  return collection(mongo).deleteMany({
    tenantID,
    id: {
      $in: ids,
    },
  });
}
