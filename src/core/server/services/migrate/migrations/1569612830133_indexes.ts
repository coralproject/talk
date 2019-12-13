import { Db, MongoError } from "mongodb";

import Migration from "coral-server/services/migrate/migration";
import collections from "coral-server/services/mongodb/collections";

import { createConnectionOrderVariants, createIndexFactory } from "../indexing";

async function createMigrationRecordIndexes(mongo: Db) {
  const createIndex = createIndexFactory(collections.migrations(mongo));

  // UNIQUE { id }
  await createIndex({ id: 1 }, { unique: true });
}

async function createUserIndexes(mongo: Db) {
  const createIndex = createIndexFactory(collections.users(mongo));

  // UNIQUE { id }
  await createIndex({ tenantID: 1, id: 1 }, { unique: true });

  // UNIQUE - PARTIAL { email }
  await createIndex(
    { tenantID: 1, email: 1 },
    { unique: true, partialFilterExpression: { email: { $exists: true } } }
  );

  // UNIQUE { profiles.type, profiles.id }
  await createIndex(
    { tenantID: 1, "profiles.type": 1, "profiles.id": 1 },
    {
      unique: true,
      partialFilterExpression: { "profiles.id": { $exists: true } },
    }
  );

  // { profiles }
  await createIndex(
    { tenantID: 1, profiles: 1, email: 1 },
    {
      partialFilterExpression: { profiles: { $exists: true } },
      background: true,
    }
  );

  // TEXT { id, username, email, createdAt }
  await createIndex(
    {
      tenantID: 1,
      id: "text",
      username: "text",
      email: "text",
      createdAt: -1,
    },
    { background: true }
  );

  const variants = createConnectionOrderVariants(
    createIndex,
    [{ createdAt: -1 }],
    { background: true }
  );

  // User Connection pagination.
  // { ...connectionParams }
  await variants({
    tenantID: 1,
  });

  // Role based User Connection pagination.
  // { role, ...connectionParams }
  await variants({
    tenantID: 1,
    role: 1,
  });

  // Suspension based User Connection pagination.
  await variants({
    tenantID: 1,
    "status.suspension.history.from.start": 1,
    "status.suspension.history.from.finish": 1,
  });

  // Ban based User Connection pagination.
  await variants({
    tenantID: 1,
    "status.ban.active": 1,
  });
}

async function createInviteIndexes(mongo: Db) {
  const createIndex = createIndexFactory(collections.invites(mongo));

  // UNIQUE { id }
  await createIndex({ tenantID: 1, id: 1 }, { unique: true });

  // UNIQUE { email }
  await createIndex({ tenantID: 1, email: 1 }, { unique: true });
}

async function createTenantIndexes(mongo: Db) {
  const createIndex = createIndexFactory(collections.tenants(mongo));

  // UNIQUE { id }
  await createIndex({ id: 1 }, { unique: true });

  // UNIQUE { domain }
  await createIndex({ domain: 1 }, { unique: true });
}

async function createStoryIndexes(mongo: Db) {
  const createIndex = createIndexFactory(collections.stories(mongo));

  // UNIQUE { id }
  await createIndex({ tenantID: 1, id: 1 }, { unique: true });

  // UNIQUE { url }
  await createIndex({ tenantID: 1, url: 1 }, { unique: true });

  // TEXT { $**, createdAt }
  await createIndex(
    { tenantID: 1, "$**": "text", createdAt: -1 },
    { background: true }
  );

  const variants = createConnectionOrderVariants(
    createIndex,
    [{ createdAt: -1 }],
    { background: true }
  );

  // Story Connection pagination.
  // { ...connectionParams }
  await variants({
    tenantID: 1,
  });

  // Closed At ordered Story Connection pagination.
  // { closedAt, ...connectionParams }
  await variants({
    tenantID: 1,
    closedAt: 1,
  });
}

async function createStoryCountIndexes(mongo: Db) {
  const createIndex = createIndexFactory(collections.stories(mongo));

  // { createdAt }
  await createIndex({ tenantID: 1, createdAt: 1 }, { background: true });
}

async function createQueriesIndexes(mongo: Db) {
  const createIndex = createIndexFactory(collections.queries(mongo));

  // UNIQUE { id }
  await createIndex({ id: 1 }, { unique: true });
}

async function createCommentActionIndexes(mongo: Db) {
  const createIndex = createIndexFactory(collections.commentActions(mongo));

  // UNIQUE { id }
  await createIndex({ tenantID: 1, id: 1 }, { unique: true });

  // { actionType, commentID, userID }
  await createIndex(
    { tenantID: 1, actionType: 1, commentID: 1, userID: 1 },
    { background: true }
  );

  const variants = createConnectionOrderVariants(
    createIndex,
    [{ createdAt: -1 }],
    { background: true }
  );

  // Connection pagination.
  // { ...connectionParams }
  await variants({
    tenantID: 1,
    actionType: 1,
    commentID: 1,
  });
}

async function createCommentModerationActionIndexes(mongo: Db) {
  const createIndex = createIndexFactory(
    collections.commentModerationActions(mongo)
  );

  // UNIQUE { id }
  await createIndex({ tenantID: 1, id: 1 }, { unique: true });

  const createVariants = createConnectionOrderVariants(createIndex, [
    { createdAt: -1 },
  ]);

  // { moderatorID, ...connectionParams }
  await createVariants({
    moderatorID: 1,
  });
}

async function createCommentIndexes(mongo: Db) {
  const createIndex = createIndexFactory(collections.comments(mongo));

  // UNIQUE { id }
  await createIndex({ tenantID: 1, id: 1 }, { unique: true });

  // Facility for counting the tags against a story.
  await createIndex(
    {
      tenantID: 1,
      storyID: 1,
      "tags.type": 1,
      status: 1,
    },
    {
      background: true,
      partialFilterExpression: {
        "tags.type": { $exists: true },
      },
    }
  );

  const streamVariants = createConnectionOrderVariants(createIndex, [
    { createdAt: -1 },
    { createdAt: 1 },
    { childCount: -1, createdAt: -1 },
    { "actionCounts.REACTION": -1, createdAt: -1 },
  ]);

  // Story based Comment Connection pagination.
  // { storyID, ...connectionParams }
  await streamVariants({
    tenantID: 1,
    storyID: 1,
    status: 1,
  });

  // Story + Reply based Comment Connection pagination.
  // { storyID, ...connectionParams }
  await streamVariants({
    tenantID: 1,
    storyID: 1,
    parentID: 1,
    status: 1,
  });

  // Author based Comment Connection pagination.
  // { authorID, ...connectionParams }
  await streamVariants({
    tenantID: 1,
    authorID: 1,
    status: 1,
  });

  // Tag based Comment Connection pagination.
  // { tags.type, ...connectionParams }
  await streamVariants({
    tenantID: 1,
    storyID: 1,
    "tags.type": 1,
  });

  const adminVariants = createConnectionOrderVariants(
    createIndex,
    [{ createdAt: -1 }, { createdAt: 1 }],
    { background: true }
  );

  // Moderation based Comment Connection pagination.
  // { storyID, ...connectionParams }
  await adminVariants({
    tenantID: 1,
    status: 1,
  });

  // Story based Comment Connection pagination that are flagged.
  // { storyID, ...connectionParams }
  await adminVariants({
    tenantID: 1,
    storyID: 1,
    status: 1,
    "actionCounts.FLAG": 1,
  });

  // Author based Comment Connection pagination.
  // { authorID, ...connectionParams }
  await adminVariants({
    tenantID: 1,
    authorID: 1,
  });
}

type IndexCreationFunction = (mongo: Db) => Promise<void>;

const indexes: Array<[string, IndexCreationFunction]> = [
  ["migrations", createMigrationRecordIndexes],
  ["users", createUserIndexes],
  ["invites", createInviteIndexes],
  ["tenants", createTenantIndexes],
  ["comments", createCommentIndexes],
  ["stories", createStoryIndexes],
  ["stories", createStoryCountIndexes],
  ["commentActions", createCommentActionIndexes],
  ["commentModerationActions", createCommentModerationActionIndexes],
  ["queries", createQueriesIndexes],
];

export default class extends Migration {
  /**
   * ensureIndexes will ensure that all indexes have been created.
   *
   * @param mongo a MongoDB Database Connection
   */
  private async ensureIndexes(mongo: Db) {
    this.logger.info(
      { indexGroupCount: indexes.length },
      "now ensuring indexes are created"
    );

    // For each of the index functions, call it.
    for (const [indexGroup, indexFunction] of indexes) {
      this.logger.info({ indexGroup }, "ensuring indexes are created");
      await indexFunction(mongo);
      this.logger.info({ indexGroup }, "indexes have been created");
    }

    this.logger.info("all indexes have been created");
  }

  public async indexes(mongo: Db) {
    // Find all the collections that exist already.
    const results = await mongo
      .listCollections({}, { nameOnly: true })
      .toArray();

    const collectionNames = results
      .filter(({ type }) => type === "collection")
      .map(({ name }) => name);

    // Drop existing indexes on managed collections so we can re-create them.
    for (const collectionName in collections) {
      if (!collections.hasOwnProperty(collectionName)) {
        continue;
      }

      // Check to see if this collection exists.
      if (!collectionNames.includes(collectionName)) {
        continue;
      }

      try {
        await mongo.collection(collectionName).dropIndexes();
      } catch (err) {
        if (err instanceof MongoError) {
          // If we're dropping indexes on a collection that doesn't exist, then
          // don't worry.
          if (err.code === 26) {
            continue;
          }
        }

        throw err;
      }
    }

    // Re-create the indexes for each collection now.
    await this.ensureIndexes(mongo);
  }
}
