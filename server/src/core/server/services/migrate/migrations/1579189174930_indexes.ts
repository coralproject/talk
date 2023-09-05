import { MongoContext } from "coral-server/data/context";
import Migration from "coral-server/services/migrate/migration";

import {
  createConnectionOrderVariants,
  createIndexesFactory,
} from "../indexing";

function createIndexer(mongo: MongoContext) {
  // Get the indexing functions ready for each of the collections.
  const index = createIndexesFactory(mongo);

  // Get the variants ready for pagination indexing.
  const variants = {
    comments: {
      admin: createConnectionOrderVariants(index.comments, [
        { createdAt: -1 },
        { createdAt: 1 },
      ]),
      stream: createConnectionOrderVariants(index.comments, [
        { createdAt: -1 },
        { createdAt: 1 },
        { childCount: -1, createdAt: -1 },
        { "actionCounts.REACTION": -1, createdAt: -1 },
      ]),
    },
    users: createConnectionOrderVariants(index.users, [{ createdAt: -1 }]),
    stories: createConnectionOrderVariants(index.stories, [{ createdAt: -1 }]),
    commentActions: createConnectionOrderVariants(index.commentActions, [
      { createdAt: -1 },
    ]),
    commentModerationActions: createConnectionOrderVariants(
      index.commentModerationActions,
      [{ createdAt: 1 }]
    ),
  };

  return { index, variants };
}

export default class extends Migration {
  public async indexes(mongo: MongoContext) {
    // Create the indexer functions.
    const { index, variants } = createIndexer(mongo);

    // Comments
    await index.comments({ tenantID: 1, id: 1 }, { unique: true });
    await index.comments(
      { tenantID: 1, "revisions.body": "text" },
      { background: true }
    );
    await index.comments(
      {
        tenantID: 1,
        storyID: 1,
        "tags.type": 1,
        status: 1,
      },
      {
        partialFilterExpression: {
          "tags.type": { $exists: true },
        },
        background: true,
      }
    );
    await variants.comments.stream({ tenantID: 1, storyID: 1 });
    await variants.comments.stream({ tenantID: 1, storyID: 1, status: 1 });
    await variants.comments.stream({
      tenantID: 1,
      storyID: 1,
      parentID: 1,
      status: 1,
    });
    await variants.comments.stream({ tenantID: 1, authorID: 1, status: 1 });
    await variants.comments.stream({ tenantID: 1, storyID: 1, "tags.type": 1 });
    await variants.comments.admin({ tenantID: 1, status: 1 });
    await variants.comments.admin({ tenantID: 1, authorID: 1 });
    await variants.comments.admin({
      tenantID: 1,
      storyID: 1,
      status: 1,
      "actionCounts.FLAG": 1,
    });

    // Stories
    await index.stories(
      { tenantID: 1, lastCommentedAt: -1 },
      {
        partialFilterExpression: { lastCommentedAt: { $exists: true } },
        background: true,
      }
    );
    await index.stories({ tenantID: 1, id: 1 }, { unique: true });
    await index.stories({ tenantID: 1, url: 1 }, { unique: true });
    await index.stories(
      { tenantID: 1, "$**": "text", createdAt: -1 },
      { background: true }
    );
    await index.stories({ tenantID: 1, createdAt: 1 }, { background: true });
    await variants.stories({ tenantID: 1 });
    await variants.stories({ tenantID: 1, closedAt: 1 });

    // Comment Moderation Actions
    await index.commentModerationActions(
      { tenantID: 1, id: 1 },
      { unique: true }
    );
    await index.commentModerationActions(
      { tenantID: 1, commentID: 1, createdAt: -1 },
      { background: true }
    );
    await variants.commentModerationActions({ tenantID: 1, moderatorID: 1 });

    // Comment Actions
    await index.commentActions({ tenantID: 1, id: 1 }, { unique: true });
    await index.commentActions(
      { tenantID: 1, actionType: 1, commentID: 1, userID: 1 },
      { background: true }
    );
    await variants.commentActions({ tenantID: 1, actionType: 1, commentID: 1 });

    // Users
    await index.users({ tenantID: 1, id: 1 }, { unique: true });
    await index.users(
      { tenantID: 1, email: 1 },
      { partialFilterExpression: { email: { $exists: true } }, unique: true }
    );
    await index.users(
      { tenantID: 1, profiles: 1, email: 1 },
      {
        partialFilterExpression: { profiles: { $exists: true } },
        background: true,
      }
    );
    await index.users(
      { tenantID: 1, scheduledDeletionDate: 1 },
      {
        partialFilterExpression: { scheduledDeletionDate: { $exists: true } },
        background: true,
      }
    );
    await index.users(
      { tenantID: 1, "notifications.digestFrequency": 1, hasDigests: 1 },
      {
        partialFilterExpression: { hasDigests: { $eq: true } },
        background: true,
      }
    );
    await index.users(
      { tenantID: 1, "profiles.id": 1, "profiles.type": 1 },
      {
        partialFilterExpression: { profiles: { $exists: true } },
        unique: true,
      }
    );
    await index.users(
      {
        tenantID: 1,
        id: "text",
        username: "text",
        email: "text",
        createdAt: -1,
      },
      { background: true }
    );
    await variants.users({ tenantID: 1 });
    await variants.users({ tenantID: 1, role: 1 });
    await variants.users({
      tenantID: 1,
      "status.suspension.history.from.start": 1,
      "status.suspension.history.from.finish": 1,
    });
    await variants.users({ tenantID: 1, "status.ban.active": 1 });

    // Invites
    await index.invites({ tenantID: 1, id: 1 }, { unique: true });
    await index.invites({ tenantID: 1, email: 1 }, { unique: true });

    // Migrations
    await index.migrations({ id: 1 }, { unique: true });

    // Tenants
    await index.tenants({ id: 1 }, { unique: true });
    await index.tenants({ domain: 1 }, { unique: true });

    // Sites
    await index.sites({ tenantID: 1, id: 1 }, { background: true });
    await index.sites({ tenantID: 1, allowedOrigins: 1 }, { unique: true });
    await index.sites({ tenantID: 1, name: 1 }, { background: true });

    // Queries
    await index.queries({ id: 1 }, { unique: true });
  }
}
