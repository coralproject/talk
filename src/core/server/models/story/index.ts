import { Db, MongoError } from "mongodb";
import uuid from "uuid";

import { DeepPartial, Omit } from "coral-common/types";
import { dotize } from "coral-common/utils/dotize";
import {
  DuplicateStoryIDError,
  DuplicateStoryURLError,
} from "coral-server/errors";
import {
  GQLStoryMetadata,
  GQLStorySettings,
} from "coral-server/graph/tenant/schema/__generated__/types";
import {
  Connection,
  ConnectionInput,
  Query,
  resolveConnection,
} from "coral-server/models/helpers";
import { GlobalModerationSettings } from "coral-server/models/settings";
import { TenantResource } from "coral-server/models/tenant";
import { stories as collection } from "coral-server/services/mongodb/collections";

import { createEmptyCommentStatusCounts } from "../comment/helpers";
import {
  createEmptyCommentModerationQueueCounts,
  StoryCommentCounts,
} from "./counts";

export * from "./counts";
export * from "./helpers";

export type StorySettings = DeepPartial<
  Pick<GQLStorySettings, "messageBox"> & GlobalModerationSettings
>;

export type StoryMetadata = GQLStoryMetadata;

export interface Story extends TenantResource {
  readonly id: string;

  /**
   * url is the URL to the Story page.
   */
  url: string;

  /**
   * metadata stores the scraped metadata from the Story page.
   */
  metadata?: StoryMetadata;

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
  settings: StorySettings;

  /**
   * closedAt is the date that the Story was forced closed at, or false to
   * indicate that the story was re-opened.
   */
  closedAt?: Date | false;

  /**
   * createdAt is the date that the Story was added to the Coral database.
   */
  createdAt: Date;
}

export interface UpsertStoryInput {
  id?: string;
  url: string;
}

export async function upsertStory(
  mongo: Db,
  tenantID: string,
  { id = uuid.v4(), url }: UpsertStoryInput,
  now = new Date()
) {
  // Create the story, optionally sourcing the id from the input, additionally
  // porting in the tenantID.
  const update: { $setOnInsert: Story } = {
    $setOnInsert: {
      id,
      url,
      tenantID,
      createdAt: now,
      commentCounts: {
        action: {},
        status: createEmptyCommentStatusCounts(),
        moderationQueue: createEmptyCommentModerationQueueCounts(),
      },
      settings: {},
    },
  };

  try {
    // Perform the find and update operation to try and find and or create the
    // story.
    const result = await collection(mongo).findOneAndUpdate(
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
  } catch (err) {
    // Evaluate the error, if it is in regards to violating the unique index,
    // then return a duplicate Story error.
    if (err instanceof MongoError && err.code === 11000) {
      throw new DuplicateStoryIDError(err, id, url);
    }

    throw err;
  }
}

export interface FindStoryInput {
  id?: string;
  url?: string;
}

export async function findStory(
  mongo: Db,
  tenantID: string,
  { id, url }: FindStoryInput
) {
  if (id) {
    return retrieveStory(mongo, tenantID, id);
  }

  if (url) {
    return retrieveStoryByURL(mongo, tenantID, url);
  }

  // Story can't be found with that ID/URL combination and scraping is
  // disabled, so we fail here.
  return null;
}

export interface FindOrCreateStoryInput {
  id?: string;
  url?: string;
}

export async function findOrCreateStory(
  mongo: Db,
  tenantID: string,
  { id, url }: FindOrCreateStoryInput,
  now = new Date()
) {
  if (id) {
    if (url) {
      // The URL was specified, this is an upsert operation.
      return upsertStory(
        mongo,
        tenantID,
        {
          id,
          url,
        },
        now
      );
    }

    // The URL was not specified, this is a lookup operation.
    return retrieveStory(mongo, tenantID, id);
  }

  // The ID was not specified, this is an upsert operation. Check to see that
  // the URL exists.
  if (!url) {
    throw new Error("cannot upsert an story without the url");
  }

  return upsertStory(mongo, tenantID, { url }, now);
}

export type CreateStoryInput = Partial<
  Pick<Story, "metadata" | "scrapedAt" | "closedAt">
>;

export async function createStory(
  mongo: Db,
  tenantID: string,
  id: string,
  url: string,
  input: CreateStoryInput,
  now = new Date()
) {
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
    settings: {},
  };

  try {
    // Insert the story into the database.
    await collection(mongo).insertOne(story);
  } catch (err) {
    // Evaluate the error, if it is in regards to violating the unique index,
    // then return a duplicate Story error.
    if (err instanceof MongoError && err.code === 11000) {
      throw new DuplicateStoryURLError(err, url, id);
    }

    throw err;
  }

  // Return the created story.
  return story;
}

export async function retrieveStoryByURL(
  mongo: Db,
  tenantID: string,
  url: string
) {
  return collection(mongo).findOne({ url, tenantID });
}

export async function retrieveStory(mongo: Db, tenantID: string, id: string) {
  return collection(mongo).findOne({ id, tenantID });
}

export async function retrieveManyStories(
  mongo: Db,
  tenantID: string,
  ids: string[]
) {
  const cursor = collection(mongo).find({
    id: { $in: ids },
    tenantID,
  });

  const stories = await cursor.toArray();

  return ids.map(id => stories.find(story => story.id === id) || null);
}

export async function retrieveManyStoriesByURL(
  mongo: Db,
  tenantID: string,
  urls: string[]
) {
  const cursor = collection(mongo).find({
    url: { $in: urls },
    tenantID,
  });

  const stories = await cursor.toArray();

  return urls.map(url => stories.find(story => story.url === url) || null);
}

export type UpdateStoryInput = Omit<
  Partial<Story>,
  "id" | "tenantID" | "closedAt" | "createdAt"
>;

export async function updateStory(
  mongo: Db,
  tenantID: string,
  id: string,
  input: UpdateStoryInput,
  now = new Date()
) {
  // Only update fields that have been updated.
  const update = {
    $set: {
      ...dotize(input, { embedArrays: true }),
      // Always update the updated at time.
      updatedAt: now,
    },
  };

  try {
    const result = await collection(mongo).findOneAndUpdate(
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
      throw new DuplicateStoryURLError(err, input.url, id);
    }

    throw err;
  }
}
export type UpdateStorySettingsInput = StorySettings;

export async function updateStorySettings(
  mongo: Db,
  tenantID: string,
  id: string,
  input: UpdateStorySettingsInput,
  now = new Date()
) {
  // Only update fields that have been updated.
  const update = {
    $set: {
      ...dotize({ settings: input }, { embedArrays: true }),
      // Always update the updated at time.
      updatedAt: now,
    },
  };

  const result = await collection(mongo).findOneAndUpdate(
    { id, tenantID },
    update,
    // False to return the updated document instead of the original
    // document.
    { returnOriginal: false }
  );

  return result.value || null;
}

export async function openStory(
  mongo: Db,
  tenantID: string,
  id: string,
  now = new Date()
) {
  const result = await collection(mongo).findOneAndUpdate(
    { id, tenantID },
    {
      $set: {
        closedAt: false,
        // Always update the updated at time.
        updatedAt: now,
      },
    },
    // False to return the updated document instead of the original
    // document.
    { returnOriginal: false }
  );

  return result.value || null;
}

export async function closeStory(
  mongo: Db,
  tenantID: string,
  id: string,
  now = new Date()
) {
  const result = await collection(mongo).findOneAndUpdate(
    { id, tenantID },
    {
      $set: {
        closedAt: now,
        // Always update the updated at time.
        updatedAt: now,
      },
    },
    // False to return the updated document instead of the original
    // document.
    { returnOriginal: false }
  );

  return result.value || null;
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

export type StoryConnectionInput = ConnectionInput<Story>;

export async function retrieveStoryConnection(
  mongo: Db,
  tenantID: string,
  input: StoryConnectionInput
): Promise<Readonly<Connection<Readonly<Story>>>> {
  // Create the query.
  const query = new Query(collection(mongo)).where({ tenantID });

  // If a filter is being applied, filter it as well.
  if (input.filter) {
    query.where(input.filter);
  }

  return retrieveConnection(input, query);
}

async function retrieveConnection(
  input: StoryConnectionInput,
  query: Query<Story>
): Promise<Readonly<Connection<Readonly<Story>>>> {
  // Apply the pagination arguments to the query.
  query.orderBy({ createdAt: -1 });
  if (input.after) {
    query.where({ createdAt: { $lt: input.after as Date } });
  }

  // Return a connection.
  return resolveConnection(query, input, story => story.createdAt);
}
