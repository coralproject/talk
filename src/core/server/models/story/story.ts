import { MongoError } from "mongodb";
import { v4 as uuid } from "uuid";

import { DeepPartial, FirstDeepPartial } from "coral-common/types";
import { dotize } from "coral-common/utils/dotize";
import { MongoContext } from "coral-server/data/context";
import {
  DuplicateStoryIDError,
  DuplicateStoryURLError,
  StoryNotFoundError,
  UserNotFoundError,
} from "coral-server/errors";
import { Comment } from "coral-server/models/comment";
import {
  Connection,
  NodeToCursorTransformer,
  OrderedConnectionInput,
  Query,
  resolveConnection,
} from "coral-server/models/helpers";
import { GlobalModerationSettings } from "coral-server/models/settings";
import { TenantResource } from "coral-server/models/tenant";

import {
  GQLCOMMENT_SORT,
  GQLCOMMENT_STATUS,
  GQLSTORY_MODE,
  GQLStoryMetadata,
  GQLStorySettings,
} from "coral-server/graph/schema/__generated__/types";

import {
  createEmptyRelatedCommentCounts,
  RelatedCommentCounts,
  updateRelatedCommentCounts,
} from "../comment/counts";
import {
  findSeenComments,
  reduceCommentIDs,
} from "../seenComments/seenComments";

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

  tree: StoryTreeComment[];
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
  mongo: MongoContext,
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
    tree: [],
  };

  if (mode) {
    story.settings.mode = mode;
  }

  try {
    // Perform the find and update operation to try and find and or create the
    // story.
    const result = await mongo.stories().findOneAndUpdate(
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
  mongo: MongoContext,
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
  mongo: MongoContext,
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
  mongo: MongoContext,
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
    tree: [],
  };

  if (mode) {
    story.settings.mode = mode;
  }

  try {
    // Insert the story into the database.
    await mongo.stories().insertOne(story);
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
  mongo: MongoContext,
  tenantID: string,
  url: string
) {
  return mongo
    .stories()
    .findOne({ url, tenantID }, { projection: { tree: 0 } });
}

export async function retrieveStory(
  mongo: MongoContext,
  tenantID: string,
  id: string
) {
  return mongo.stories().findOne({ id, tenantID }, { projection: { tree: 0 } });
}

export async function retrieveManyStories(
  mongo: MongoContext,
  tenantID: string,
  ids: ReadonlyArray<string>
) {
  const cursor = mongo.stories().find(
    {
      id: { $in: ids },
      tenantID,
    },
    { projection: { tree: 0 } }
  );

  const stories = await cursor.toArray();

  return ids.map((id) => stories.find((story) => story.id === id) || null);
}

export async function retrieveManyStoriesByURL(
  mongo: MongoContext,
  tenantID: string,
  urls: ReadonlyArray<string>
) {
  const cursor = mongo.stories().find(
    {
      url: { $in: urls },
      tenantID,
    },
    { projection: { tree: 0 } }
  );

  const stories = await cursor.toArray();

  return urls.map((url) => stories.find((story) => story.url === url) || null);
}

export type UpdateStoryInput = Omit<
  Partial<Story>,
  "id" | "tenantID" | "closedAt" | "createdAt" | "siteID"
>;

export async function updateStory(
  mongo: MongoContext,
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
    const result = await mongo.stories().findOneAndUpdate(
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
  mongo: MongoContext,
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

  const result = await mongo.stories().findOneAndUpdate(
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
  mongo: MongoContext,
  tenantID: string,
  id: string,
  now = new Date()
) {
  const result = await mongo.stories().findOneAndUpdate(
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
  mongo: MongoContext,
  tenantID: string,
  id: string,
  now = new Date()
) {
  const result = await mongo.stories().findOneAndUpdate(
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

export async function removeStory(
  mongo: MongoContext,
  tenantID: string,
  id: string
) {
  const result = await mongo.stories().findOneAndDelete({
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
  mongo: MongoContext,
  tenantID: string,
  ids: string[]
) {
  return mongo.stories().deleteMany({
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
  mongo: MongoContext,
  tenantID: string,
  input: StoryConnectionInput
): Promise<Readonly<Connection<Readonly<Story>>>> {
  // Create the query.
  const query = new Query(mongo.stories()).where({ tenantID });

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
  mongo: MongoContext,
  tenantID: string,
  limit: number
) {
  const stories = await mongo
    .stories()
    .find(
      {
        tenantID,
        // We limit this query to stories that have the following field. This
        // allows us to use the index.
        lastCommentedAt: {
          $exists: true,
        },
      },
      { projection: { tree: 0 } }
    )
    .sort({ lastCommentedAt: -1 })
    .limit(limit)
    .toArray();

  return stories;
}

export async function updateStoryLastCommentedAt(
  mongo: MongoContext,
  tenantID: string,
  storyID: string,
  now: Date
) {
  await mongo.stories().updateOne(
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
  mongo: MongoContext,
  tenantID: string,
  id: string,
  commentCounts: FirstDeepPartial<RelatedCommentCounts>
) => updateRelatedCommentCounts(mongo.stories(), tenantID, id, commentCounts);

export async function addStoryExpert(
  mongo: MongoContext,
  tenantID: string,
  storyID: string,
  userID: string
) {
  const result = await mongo.stories().findOneAndUpdate(
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
  mongo: MongoContext,
  tenantID: string,
  storyID: string,
  userID: string
) {
  const result = await mongo.stories().findOneAndUpdate(
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
  mongo: MongoContext,
  tenantID: string,
  storyID: string,
  mode: GQLSTORY_MODE
) {
  const result = await mongo.stories().findOneAndUpdate(
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
  mongo: MongoContext,
  tenantID: string
): Promise<string[]> {
  const results: Array<
    string | null
  > = await mongo.stories().distinct("metadata.section", { tenantID });

  // We perform the type assertion here because we know that after filtering out
  // the null entries, the resulting array can not contain null.
  return results.filter((section) => section !== null).sort() as string[];
}

/**
 * This is used when we are locking a story to put it into an archiving state.
 * We currently use this for the markStoryForArchiving and the
 * retrieveStoryToBeArchived functions to avoid duplication of the $set logic.
 *
 * @param now the time we are archiving at
 * @returns the $set param for marking a story as currently in an archiving
 * state.
 */
function getMarkStoryForArchivingSetParam(now: Date) {
  return {
    $set: {
      isArchiving: true,
      closedAt: now,
      updatedAt: now,
      startedArchivingAt: now,
    },
  };
}

export async function forceMarkStoryForArchiving(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  now: Date
) {
  const result = await mongo.stories().findOneAndUpdate(
    {
      id,
      tenantID,
    },
    getMarkStoryForArchivingSetParam(now),
    {
      returnOriginal: false,
    }
  );

  return result.value;
}

export async function markStoryForArchiving(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  now: Date
) {
  const result = await mongo.stories().findOneAndUpdate(
    {
      id,
      tenantID,
      isArchiving: { $in: [null, false] },
      isArchived: { $in: [null, false] },
      "settings.mode": { $ne: GQLSTORY_MODE.RATINGS_AND_REVIEWS },
    },
    getMarkStoryForArchivingSetParam(now),
    {
      returnOriginal: false,
    }
  );

  return result.value;
}

export async function markStoryForUnarchiving(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  now: Date
) {
  const result = await mongo.stories().findOneAndUpdate(
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
        startedUnarchivingAt: now,
      },
    },
    {
      returnOriginal: false,
    }
  );

  return result.value;
}

export async function retrieveStoriesToBeArchived(
  mongo: MongoContext,
  tenantID: string,
  olderThan: Date,
  now: Date,
  count: number
): Promise<Readonly<Story>[]> {
  const result = await mongo
    .stories()
    .find(
      {
        tenantID,
        $or: [
          { lastCommentedAt: { $lte: olderThan } },
          {
            $and: [
              { lastCommentedAt: null },
              { createdAt: { $lte: olderThan } },
            ],
          },
        ],
        isArchiving: { $in: [null, false] },
        isArchived: { $in: [null, false] },
        startedUnarchivingAt: { $in: [null, false] },
        unarchivedAt: { $in: [null, false] },
        "settings.mode": { $ne: GQLSTORY_MODE.RATINGS_AND_REVIEWS },
      },
      { projection: { tree: 0 } }
    )
    .limit(count)
    .toArray();

  return result;
}

export async function markStoryAsArchived(
  mongo: MongoContext,
  tenantID: string,
  storyID: string,
  now: Date
) {
  const result = await mongo.stories().findOneAndUpdate(
    { id: storyID, tenantID },
    {
      $set: {
        isArchiving: false,
        isArchived: true,
        archivedAt: now,
      },
    },
    {
      returnOriginal: false,
    }
  );

  return result.value;
}

export async function markStoryAsUnarchived(
  mongo: MongoContext,
  tenantID: string,
  storyID: string,
  now: Date
) {
  const result = await mongo.stories().findOneAndUpdate(
    { id: storyID, tenantID },
    {
      $set: {
        isArchiving: false,
        isArchived: false,
        unarchivedAt: now,
      },
    },
    {
      returnOriginal: false,
    }
  );

  return result.value;
}

interface StoryTreeComment {
  id: string;
  authorID: string | null;
  status: GQLCOMMENT_STATUS;
  replies: StoryTreeComment[];
}

async function findChildren(
  root: Readonly<StoryTreeComment>,
  comments: Readonly<Comment>[]
) {
  return comments
    .filter((c) => c.parentID === root.id)
    .map((c) => {
      return {
        id: c.id,
        authorID: c.authorID,
        status: c.status,
        replies: [],
      };
    });
}

async function createTree(
  root: Readonly<StoryTreeComment>,
  comments: Readonly<Comment>[]
) {
  const tree: StoryTreeComment = {
    id: root.id,
    authorID: root.authorID,
    status: root.status,
    replies: [],
  };

  const children = await findChildren(root, comments);
  for (const child of children) {
    const subTree = await createTree(child, comments);
    tree.replies.push(subTree);
  }

  return tree;
}

export async function generateTreeForStory(
  mongo: MongoContext,
  tenantID: string,
  storyID: string
) {
  const result = await mongo
    .comments()
    .find({
      tenantID,
      storyID,
    })
    .sort({ createdAt: -1 })
    .toArray();

  const tree = await createTreeFromComments(result);
  await writeTreeToStory(mongo, tenantID, storyID, tree);
}

async function createTreeFromComments(comments: Readonly<Comment>[]) {
  const rootComments = comments.filter(
    (c) => c.parentID === null || c.parentID === undefined
  );

  const tree: StoryTreeComment[] = [];

  for (const rootComment of rootComments) {
    const subTree = await createTree(
      {
        id: rootComment.id,
        authorID: rootComment.authorID,
        status: rootComment.status,
        replies: [],
      },
      comments
    );
    tree.push(subTree);
  }

  return tree;
}

interface StoryTreeUpdate {
  filter: any;
  update: any;
}

function computeWriteStoryToTreeUpdate(
  tenantID: string,
  storyID: string,
  tree: StoryTreeComment[]
): StoryTreeUpdate {
  return {
    filter: { tenantID, id: storyID },
    update: {
      $set: {
        tree,
      },
    },
  };
}

async function writeTreeToStory(
  mongo: MongoContext,
  tenantID: string,
  storyID: string,
  tree: StoryTreeComment[]
) {
  const operation = computeWriteStoryToTreeUpdate(tenantID, storyID, tree);

  await mongo.stories().updateOne(operation.filter, operation.update);
}

/**
 * Max level of nesting from MongoDB.
 *
 * @see https://www.mongodb.com/docs/manual/reference/limits/#mongodb-limit-Nested-Depth-for-BSON-Documents
 */
const MAX_LEVEL_NESTING = 100;

/**
 * Max level of ancestors is nesting max, halved (because of the structure of
 * the tree) and minus two (because the root and tree element itself count).
 */
const MAX_ANCESTORS = Math.ceil(MAX_LEVEL_NESTING / 2) - 2;

const KEYS = "abcdefghijklmnopqrstuvwxyz";

const createArrayKeyChar = (i: number) => {
  return KEYS[i % KEYS.length].repeat(Math.floor(i / KEYS.length) + 1);
};

const createKey = (ids: string[]) => {
  if (ids.length > MAX_ANCESTORS) {
    throw new Error("too many ancestors");
  }

  let key = "tree";

  // ancestorIDs are in reverse order. So process this in reverse.
  for (let i = ids.length - 1; i >= 0; i--) {
    key += `.$[${createArrayKeyChar(i)}].replies`;
  }

  return key;
};

const createArrayFilters = (ids: string[]) => {
  if (ids.length > MAX_ANCESTORS) {
    throw new Error("too many ancestors");
  }

  const filters = [];

  // ancestorIDs are in reverse order. So process this in reverse.
  for (let i = ids.length - 1; i >= 0; i--) {
    filters.push({ [`${createArrayKeyChar(i)}.id`]: ids[i] });
  }

  return filters;
};

const createNode = ({
  id,
  status,
  authorID,
}: Readonly<Comment>): StoryTreeComment => ({
  id,
  status,
  authorID,
  replies: [],
});

export async function addCommentToStoryTree(
  mongo: MongoContext,
  tenantID: string,
  storyID: string,
  comment: Readonly<Comment>
) {
  const query = { tenantID, id: storyID };
  const update = {
    $push: {
      [createKey(comment.ancestorIDs)]: {
        $each: [createNode(comment)],
        $position: 0,
      },
    },
  };
  const options = {
    arrayFilters: createArrayFilters(comment.ancestorIDs),
    returnDocument: "after",
  };

  const result = await mongo.stories().findOneAndUpdate(query, update, options);

  return result.value;
}

export async function updateCommentOnStoryTree(
  mongo: MongoContext,
  tenantID: string,
  storyID: string,
  comment: Readonly<Comment>
) {
  let key = createKey([comment.id, ...comment.ancestorIDs]);

  // key now contains a `.replies` we want to replace with `.status`.
  key = key.replace(/\.replies$/, ".status");

  const query = { tenantID, id: storyID };
  const update = {
    $set: {
      [key]: comment.status,
    },
  };
  const options = {
    arrayFilters: createArrayFilters([comment.id, ...comment.ancestorIDs]),
    returnDocument: "after",
  };

  const result = await mongo.stories().findOneAndUpdate(query, update, options);

  return result.value;
}

const VISIBLE_STATUSES = [GQLCOMMENT_STATUS.APPROVED, GQLCOMMENT_STATUS.NONE];

function pruneCommentForVisibleComments(
  comment: StoryTreeComment,
  visibleStatuses: GQLCOMMENT_STATUS[],
  ignoredAuthorIDs: string[]
) {
  // If a comment is not visible to the stream, the user cannot
  // tab/Z_KEY/c-key to it, ignore it and continue on.
  if (!VISIBLE_STATUSES.includes(comment.status)) {
    return null;
  }
  // Ignore any ignored users, we do not stop to read these comments
  // as they are not visible to the current user.
  if (comment.authorID && ignoredAuthorIDs.includes(comment.authorID)) {
    return null;
  }

  // Recursively check all our replies the same as we did the root above.
  // We'll walk down each level and if it's null, we don't include it.
  const visibleReplies: StoryTreeComment[] = [];
  for (const reply of comment.replies) {
    const result = pruneCommentForVisibleComments(
      reply,
      visibleStatuses,
      ignoredAuthorIDs
    );
    if (result) {
      visibleReplies.push(result);
    }
  }

  // Return the us + the valid replies under ourself.
  return {
    ...comment,
    replies: visibleReplies,
  };
}

// Helper function to iterate over all the linear first array of
// root comments at the start of the story's comment tree. This is
// essentially just a filter in a for-loop that starts the recursion
// down the tree with the above actual recursive op function.
function pruneTreeForVisibleComments(
  tree: StoryTreeComment[],
  visibleStatuses: GQLCOMMENT_STATUS[],
  ignoredAuthorIDs: string[]
) {
  const visibleRootComments: StoryTreeComment[] = [];
  for (const rootComment of tree) {
    // Start the recursion
    const result = pruneCommentForVisibleComments(
      rootComment,
      visibleStatuses,
      ignoredAuthorIDs
    );

    // If it's null, the comment is ignored or not visible, only
    // add to visible list if the comment isn't null.
    if (result) {
      visibleRootComments.push(result);
    }
  }

  return visibleRootComments;
}

interface FlattenedTreeComment extends StoryTreeComment {
  rootIndex: number;
}

function flattenComment(
  comment: StoryTreeComment,
  rootIndex: number,
  result: FlattenedTreeComment[]
) {
  result.push({ ...comment, rootIndex });

  // Default ordering in story tree is newest first, but replies are
  // always oldest first order, so we need to flip this around.
  for (let i = comment.replies.length - 1; i >= 0; i--) {
    const reply = comment.replies[i];
    flattenComment(reply, rootIndex, result);
  }
}

function flattenTree(
  tree: StoryTreeComment[],
  orderBy: GQLCOMMENT_SORT,
  result: FlattenedTreeComment[]
) {
  if (orderBy === GQLCOMMENT_SORT.CREATED_AT_DESC) {
    for (let i = 0; i < tree.length; i++) {
      const rootComment = tree[i];
      flattenComment(rootComment, i, result);
    }
  } else if (orderBy === GQLCOMMENT_SORT.CREATED_AT_ASC) {
    let index = 0;
    for (let i = tree.length - 1; i >= 0; i--) {
      const rootComment = tree[i];
      flattenComment(rootComment, index, result);
      index++;
    }
  }
}

export async function findNextUnseenVisibleCommentID(
  mongo: MongoContext,
  tenantID: string,
  storyID: string,
  userID: string,
  orderBy: GQLCOMMENT_SORT,
  currentCommentID?: string,
  viewNewCount?: number
) {
  if (
    ![GQLCOMMENT_SORT.CREATED_AT_ASC, GQLCOMMENT_SORT.CREATED_AT_DESC].includes(
      orderBy
    )
  ) {
    throw new Error(
      "invalid orderBy detected: only ascending and descending order is supported."
    );
  }

  const story = await mongo.stories().findOne({ tenantID, id: storyID });
  if (!story) {
    throw new StoryNotFoundError(storyID);
  }

  const user = await mongo.users().findOne({ tenantID, id: userID });
  if (!user) {
    throw new UserNotFoundError(userID);
  }
  const ignoredUserIDs = user.ignoredUsers.map((u) => u.id);

  // Grab the user's seen comments collection and handle if it is null.
  // Our dictionary/map of id -> Date will be the `seen` variable.
  const seenComments = await findSeenComments(mongo, tenantID, {
    storyID,
    userID,
  });
  const seen = seenComments
    ? seenComments.comments
    : reduceCommentIDs([], new Date());

  // Find a tree of only the visible comments. A comment is deemed
  // visible if its status is in the VISIBLE_STATUSES or it is not
  // authored by one of the user's ignored users.
  const prunedTree = pruneTreeForVisibleComments(
    story.tree,
    VISIBLE_STATUSES,
    ignoredUserIDs
  );

  // Flatten our pruned tree with only visible comments
  const stack: FlattenedTreeComment[] = [];
  flattenTree(prunedTree, orderBy, stack);

  // Find our current position in the stack by the passed in
  // commentID that our commenter is currently focused on
  // with Z_KEY traversal.
  // If currentCommentID is null, set cursor so we start at
  // beginning of stack if order is ascending and end of stack if
  // order is descending.
  let cursor = 0;
  if (!currentCommentID) {
    // if (orderBy === GQLCOMMENT_SORT.CREATED_AT_ASC) {
    //   cursor = -1;
    // } else if (orderBy === GQLCOMMENT_SORT.CREATED_AT_DESC) {
    //   cursor = 0;
    // }
    cursor = -1;
  } else {
    cursor = stack.findIndex((c) => c.id === currentCommentID);
    if (cursor === -1) {
      return { commentID: null, index: null };
    }
  }

  // We are going to walk the full length of the stack now, but
  // we will use the cursor position we found to determine our start
  // position for our search.
  //
  // If we hit the end of the stack, we will loop around to the
  // "start" depending on the direction we're going so that
  // we search the whole stream for unseen comments even if we are
  // at the bottom/top of the stream.
  //
  // Because of this weird offset traversal, we are doing one loop
  // with i through the whole stack length, but we will also increment
  // the cursor we computed earlier. Some folks might prefer using one
  // variable to traverse this with an offset, but I tend to like
  // abstracting the "do the whole loop" (with `i`) and the "where am
  // I in the search?" (with `cursor`) as two separate variables.

  let loopedAround = false;

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < stack.length; i++) {
    cursor++;

    // If we hit the end of the stack, start at the beginning
    // and "loopAround" until we get to right behind where our
    // cursor started
    if (cursor >= stack.length) {
      loopedAround = true;
      cursor = 0;
    }

    // Pull the comment out via the cursor
    const comment = stack[cursor];

    // We don't count our own comments as unread stops, we have always
    // seen our own comments
    if (comment.authorID === userID) {
      continue;
    }

    // If this is true, we have found a new unseen comment
    // return it, we're done!
    if (!(comment.id in seen)) {
      // Offset by the client's provided viewNewCount so that our
      // indices are accurate
      const computedIndex =
        viewNewCount && viewNewCount > 0
          ? comment.rootIndex - viewNewCount
          : comment.rootIndex;

      let needToLoadNew = false;
      // If the user did not provide a comment ID (at start of stream)
      // and they have a viewNewCount, tell them to load in the new
      // comments
      if (!currentCommentID && viewNewCount && viewNewCount > 0) {
        needToLoadNew = true;
      }
      // If the user looped around and they have have a viewNewCount,
      // they likely want to load in the new comments before traversing
      // to the next comment
      if (loopedAround && viewNewCount && viewNewCount > 0) {
        needToLoadNew = true;
      }

      return { commentID: comment.id, index: computedIndex, needToLoadNew };
    }
  }

  // If we get here, we traversed the whole stream and found no unseen
  // comments. We're done, return nothing.
  return { commentID: null, index: null };
}

async function executBulkStoryTreeWrites(
  mongo: MongoContext,
  operations: StoryTreeUpdate[]
) {
  const bulk = mongo.stories().initializeUnorderedBulkOp();
  for (const operation of operations) {
    bulk.find(operation.filter).updateOne(operation.update);
  }

  await bulk.execute();
}

export async function regenerateStoryTrees(
  mongo: MongoContext,
  tenantID: string
) {
  const BATCH_SIZE = 100;

  const cursor = mongo.stories().find({ tenantID });

  let operations = [];
  let count = 0;
  let story = await cursor.next();
  while (story !== null) {
    const comments = await mongo
      .comments()
      .find({ tenantID, storyID: story.id })
      .sort({ createdAt: -1 })
      .toArray();
    const tree = await createTreeFromComments(comments);

    const operation = computeWriteStoryToTreeUpdate(tenantID, story.id, tree);
    operations.push(operation);

    story = await cursor.next();
    count++;

    if (count >= BATCH_SIZE) {
      await executBulkStoryTreeWrites(mongo, operations);
      operations = [];
    }
  }

  if (operations.length > 0) {
    await executBulkStoryTreeWrites(mongo, operations);
  }

  return true;
}
