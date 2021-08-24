import { Db, MongoError } from "mongodb";
import { v4 as uuid } from "uuid";

import { DeepPartial, FirstDeepPartial } from "coral-common/types";
import { dotize } from "coral-common/utils/dotize";
import {
  DuplicateStoryIDError,
  DuplicateStoryURLError,
  StoryNotFoundError,
} from "coral-server/errors";
import {
  Connection,
  NodeToCursorTransformer,
  OrderedConnectionInput,
  Query,
  resolveConnection,
} from "coral-server/models/helpers";
import { GlobalModerationSettings } from "coral-server/models/settings";
import { TenantResource } from "coral-server/models/tenant";
import { stories as collection } from "coral-server/services/mongodb/collections";

import {
  GQLSTORY_MODE,
  GQLStoryMetadata,
  GQLStorySettings,
} from "coral-server/graph/schema/__generated__/types";

import {
  createEmptyRelatedCommentCounts,
  RelatedCommentCounts,
  updateRelatedCommentCounts,
} from "../comment/counts";

export * from "./helpers";

export interface StreamModeSettings {
  /**
   * mode is whether the story stream is in commenting or Q&A mode.
   * This will determine the appearance of the stream and how it functions.
   * This is an optional parameter and if unset, defaults to commenting.
   */
  mode?: GQLSTORY_MODE;

  /**
   * experts are used during Q&A mode to assign users to answer questions
   * on a Q&A stream. It is an optional parameter and is only used when
   * the story stream is in Q&A mode.
   */
  expertIDs?: string[];
}

export type StorySettings = StreamModeSettings &
  GlobalModerationSettings &
  Pick<GQLStorySettings, "messageBox" | "mode">;

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
  commentCounts: RelatedCommentCounts;

  /**
   * settings provides a point where the settings can be overridden for a
   * specific Story.
   */
  settings: DeepPartial<StorySettings>;

  /**
   * closedAt is the date that the Story was forced closed at, or false to
   * indicate that the story was re-opened.
   */
  closedAt?: Date | false;

  /**
   * createdAt is the date that the Story was added to the Coral database.
   */
  createdAt: Date;

  /**
   * lastCommentedAt is the last time someone commented on this story.
   */
  lastCommentedAt?: Date;

  /**
   * siteID references the site the story belongs to
   */
  siteID: string;

  isArchiving?: boolean;
  isArchived?: boolean;
}

export interface UpsertStoryInput {
  id?: string;
  url: string;
  mode?: GQLSTORY_MODE;
  siteID: string;
}

export interface UpsertStoryResult {
  story: Story;
  wasUpserted: boolean;
}

export async function upsertStory(
  mongo: Db,
  tenantID: string,
  { id = uuid(), url, mode, siteID }: UpsertStoryInput,
  now = new Date()
): Promise<UpsertStoryResult> {
  // Create the story, optionally sourcing the id from the input, additionally
  // porting in the tenantID.
  const story: Story = {
    id,
    url,
    tenantID,
    siteID,
    createdAt: now,
    commentCounts: createEmptyRelatedCommentCounts(),
    settings: {},
  };

  if (mode) {
    story.settings.mode = mode;
  }

  try {
    // Perform the find and update operation to try and find and or create the
    // story.
    const result = await collection(mongo).findOneAndUpdate(
      {
        url,
        tenantID,
      },
      { $setOnInsert: story },
      {
        // Create the object if it doesn't already exist.
        upsert: true,

        // True to return the original document instead of the updated document.
        // This will ensure that when an upsert operation adds a new Story, it
        // should return null.
        returnOriginal: true,
      }
    );

    return {
      // The story will either be found (via `result.value`) or upserted (via
      // `story`).
      story: result.value || story,

      // The story was upserted if the value isn't provided.
      wasUpserted: !result.value,
    };
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
  mode?: GQLSTORY_MODE;
}

export interface FindOrCreateStoryResult {
  story: Story | null;
  wasUpserted: boolean;
}

export async function findOrCreateStory(
  mongo: Db,
  tenantID: string,
  { id, url, mode }: FindOrCreateStoryInput,
  siteID: string | null,
  now = new Date()
): Promise<FindOrCreateStoryResult> {
  if (id) {
    if (url && siteID) {
      // The URL was specified, this is an upsert operation.
      return upsertStory(
        mongo,
        tenantID,
        {
          id,
          url,
          mode,
          siteID,
        },
        now
      );
    }

    // The URL was not specified, this is a lookup operation.
    const story = await retrieveStory(mongo, tenantID, id);

    // Return the result object.
    return {
      story,
      wasUpserted: false,
    };
  }

  // The ID was not specified, this is an upsert operation. Check to see that
  // the URL exists.
  if (!url) {
    throw new Error("cannot upsert an story without the url");
  }

  if (!siteID) {
    throw new Error("cannot upsert story without site ID");
  }

  return upsertStory(mongo, tenantID, { url, mode, siteID }, now);
}

export type CreateStoryInput = Partial<
  Pick<Story, "metadata" | "scrapedAt" | "closedAt"> &
    Pick<StorySettings, "mode">
> &
  Pick<Story, "siteID"> & {
    mode?: GQLSTORY_MODE;
  };

export async function createStory(
  mongo: Db,
  tenantID: string,
  id: string,
  url: string,
  { siteID, metadata, scrapedAt, closedAt, mode }: CreateStoryInput,
  now = new Date()
) {
  // Create the story.
  const story: Story = {
    id,
    url,
    tenantID,
    siteID,
    metadata,
    scrapedAt,
    createdAt: now,
    closedAt,
    commentCounts: createEmptyRelatedCommentCounts(),
    settings: {},
  };

  if (mode) {
    story.settings.mode = mode;
  }

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
  ids: ReadonlyArray<string>
) {
  const cursor = collection(mongo).find({
    id: { $in: ids },
    tenantID,
  });

  const stories = await cursor.toArray();

  return ids.map((id) => stories.find((story) => story.id === id) || null);
}

export async function retrieveManyStoriesByURL(
  mongo: Db,
  tenantID: string,
  urls: ReadonlyArray<string>
) {
  const cursor = collection(mongo).find({
    url: { $in: urls },
    tenantID,
  });

  const stories = await cursor.toArray();

  return urls.map((url) => stories.find((story) => story.url === url) || null);
}

export type UpdateStoryInput = Omit<
  Partial<Story>,
  "id" | "tenantID" | "closedAt" | "createdAt" | "siteID"
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
    if (!result.value) {
      throw new StoryNotFoundError(id);
    }

    return result.value;
  } catch (err) {
    // Evaluate the error, if it is in regards to violating the unique index,
    // then return a duplicate Story error.
    if (err instanceof MongoError && err.code === 11000 && input.url) {
      throw new DuplicateStoryURLError(err, input.url, id);
    }

    throw err;
  }
}
export type UpdateStorySettingsInput = DeepPartial<StorySettings>;

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
  if (!result.value) {
    throw new StoryNotFoundError(id);
  }

  return result.value;
}

export async function openStory(
  mongo: Db,
  tenantID: string,
  id: string,
  now = new Date()
) {
  const result = await collection(mongo).findOneAndUpdate(
    {
      id,
      tenantID,
      isArchived: { $in: [null, false] },
      isArchiving: { $in: [null, false] },
    },
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
  if (!result.value) {
    throw new StoryNotFoundError(id);
  }

  return result.value;
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
  if (!result.value) {
    throw new StoryNotFoundError(id);
  }

  return result.value;
}

export async function removeStory(mongo: Db, tenantID: string, id: string) {
  const result = await collection(mongo).findOneAndDelete({
    id,
    tenantID,
  });
  if (!result.value) {
    throw new StoryNotFoundError(id);
  }

  return result.value;
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

export enum STORY_SORT {
  CREATED_AT_DESC = "CREATED_AT_DESC",
  TEXT_SCORE = "TEXT_SCORE",
}

export type StoryConnectionInput = OrderedConnectionInput<Story, STORY_SORT>;

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

const retrieveConnection = async (
  input: StoryConnectionInput,
  query: Query<Story>
): Promise<Readonly<Connection<Readonly<Story>>>> =>
  resolveConnection(
    applyInputToQuery(input, query),
    input,
    cursorGetterFactory(input)
  );

function cursorGetterFactory(
  input: Pick<StoryConnectionInput, "orderBy" | "after">
): NodeToCursorTransformer<Story> {
  switch (input.orderBy) {
    case STORY_SORT.CREATED_AT_DESC:
      return (story) => story.createdAt;
    case STORY_SORT.TEXT_SCORE:
      return (_, index) =>
        (input.after ? (input.after as number) : 0) + index + 1;
  }
}

function applyInputToQuery(input: StoryConnectionInput, query: Query<Story>) {
  switch (input.orderBy) {
    case STORY_SORT.CREATED_AT_DESC:
      query.orderBy({ createdAt: -1 });
      if (input.after) {
        query.where({ createdAt: { $lt: input.after as Date } });
      }
      return query;
    case STORY_SORT.TEXT_SCORE:
      // TODO: (wyattjoh) in MongoDB 4.4+ we don't have to project, remove after upgrading.
      query.project({ score: { $meta: "textScore" } });
      query.orderBy({ score: { $meta: "textScore" } });
      if (input.after) {
        query.after(input.after as number);
      }
      return query;
  }
}

export async function retrieveActiveStories(
  mongo: Db,
  tenantID: string,
  limit: number
) {
  const stories = await collection(mongo)
    .find({
      tenantID,
      // We limit this query to stories that have the following field. This
      // allows us to use the index.
      lastCommentedAt: {
        $exists: true,
      },
    })
    .sort({ lastCommentedAt: -1 })
    .limit(limit)
    .toArray();

  return stories;
}

export async function updateStoryLastCommentedAt(
  mongo: Db,
  tenantID: string,
  storyID: string,
  now: Date
) {
  await collection(mongo).updateOne(
    {
      tenantID,
      id: storyID,
    },
    {
      $set: {
        lastCommentedAt: now,
      },
    }
  );
}

/**
 * updateStoryCounts will update the comment counts for the story indicated.
 *
 * @param mongo mongodb database handle
 * @param tenantID ID of the Tenant where the Story is on
 * @param id the ID of the Story that we are updating counts on
 * @param commentCounts the counts that we are updating
 */
export const updateStoryCounts = (
  mongo: Db,
  tenantID: string,
  id: string,
  commentCounts: FirstDeepPartial<RelatedCommentCounts>
) => updateRelatedCommentCounts(collection(mongo), tenantID, id, commentCounts);

export async function addStoryExpert(
  mongo: Db,
  tenantID: string,
  storyID: string,
  userID: string
) {
  const result = await collection(mongo).findOneAndUpdate(
    {
      tenantID,
      id: storyID,
    },
    {
      $addToSet: {
        "settings.expertIDs": userID,
      },
    },
    {
      returnOriginal: false,
    }
  );
  if (!result.value) {
    throw new StoryNotFoundError(storyID);
  }

  return result.value;
}

export async function removeStoryExpert(
  mongo: Db,
  tenantID: string,
  storyID: string,
  userID: string
) {
  const result = await collection(mongo).findOneAndUpdate(
    {
      tenantID,
      id: storyID,
    },
    {
      $pull: {
        "settings.expertIDs": userID,
      },
    },
    {
      returnOriginal: false,
    }
  );
  if (!result.value) {
    throw new StoryNotFoundError(storyID);
  }

  return result.value;
}

export async function setStoryMode(
  mongo: Db,
  tenantID: string,
  storyID: string,
  mode: GQLSTORY_MODE
) {
  const result = await collection(mongo).findOneAndUpdate(
    {
      tenantID,
      id: storyID,
    },
    {
      $set: {
        "settings.mode": mode,
      },
    },
    {
      returnOriginal: false,
    }
  );
  if (!result.value) {
    throw new StoryNotFoundError(storyID);
  }

  return result.value;
}

/**
 * retrieveStorySections will return the sections used by stories in the
 * database for a given Tenant sorted alphabetically.
 *
 * @param mongo the database connection to use to retrieve the data
 * @param tenantID the ID of the Tenant that we're retrieving data
 */
export async function retrieveStorySections(
  mongo: Db,
  tenantID: string
): Promise<string[]> {
  const results: Array<string | null> = await collection(
    mongo
  ).distinct("metadata.section", { tenantID });

  // We perform the type assertion here because we know that after filtering out
  // the null entries, the resulting array can not contain null.
  return results.filter((section) => section !== null).sort() as string[];
}

export async function markStoryForArchiving(
  mongo: Db,
  tenantID: string,
  id: string,
  now: Date
) {
  const result = await collection(mongo).findOneAndUpdate(
    {
      id,
      tenantID,
      isArchiving: { $in: [null, false] },
      isArchived: { $in: [null, false] },
    },
    {
      $set: {
        isArchiving: true,
        closedAt: now,
        updatedAt: now,
        archivedAt: now,
      },
    },
    {
      returnOriginal: false,
    }
  );

  return result.value;
}

export async function markStoryForUnarchiving(
  mongo: Db,
  tenantID: string,
  id: string,
  now: Date
) {
  const result = await collection(mongo).findOneAndUpdate(
    {
      id,
      tenantID,
      isArchiving: false,
      isArchived: true,
    },
    {
      $set: {
        isArchiving: true,
        closedAt: now,
        updatedAt: now,
        unarchivedAt: now,
      },
    },
    {
      returnOriginal: false,
    }
  );

  return result.value;
}

export async function retrieveStoriesToBeArchived(
  mongo: Db,
  tenantID: string,
  olderThan: Date,
  limit: number
) {
  const stories = await collection(mongo)
    .find({
      tenantID,
      createdAt: { $lte: olderThan },
      isArchiving: { $in: [null, false] },
      isArchived: { $in: [null, false] },
      unarchivedAt: { $in: [null, false] },
    })
    .limit(limit)
    .toArray();

  return stories;
}
