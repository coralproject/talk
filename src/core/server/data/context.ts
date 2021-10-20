import { Collection, Db } from "mongodb";

import { Config } from "coral-server/config";
import { CommentAction } from "coral-server/models/action/comment";
import { CommentModerationAction } from "coral-server/models/action/moderation/comment";
import { Comment } from "coral-server/models/comment";
import { createCollection } from "coral-server/models/helpers";
import { Invite } from "coral-server/models/invite";
import { MigrationRecord } from "coral-server/models/migration";
import { PersistedQuery } from "coral-server/models/queries";
import { Site } from "coral-server/models/site";
import { Story } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import { createMongoDB } from "coral-server/services/mongodb";

export interface MongoContext {
  readonly live: Db;
  readonly archive?: Db;

  users(): Collection<Readonly<User>>;
  invites(): Collection<Readonly<Invite>>;
  tenants(): Collection<Readonly<Tenant>>;
  sites(): Collection<Readonly<Site>>;
  stories(): Collection<Readonly<Story>>;
  comments(): Collection<Readonly<Comment>>;
  commentActions(): Collection<Readonly<CommentAction>>;
  commentModerationActions(): Collection<Readonly<CommentModerationAction>>;
  queries(): Collection<Readonly<PersistedQuery>>;
  migrations(): Collection<Readonly<MigrationRecord>>;
  archivedComments(): Collection<Readonly<Comment>>;
  archivedCommentActions(): Collection<Readonly<CommentAction>>;
  archivedCommentModerationActions(): Collection<
    Readonly<CommentModerationAction>
  >;
}

export class MongoContextImpl implements MongoContext {
  public readonly live: Db;
  public readonly archive?: Db;

  constructor(live: Db, archive?: Db) {
    this.live = live;
    this.archive = archive;
  }

  public users(): Collection<Readonly<User>> {
    return createCollection<User>("users")(this.live);
  }
  public invites(): Collection<Readonly<Invite>> {
    return createCollection<Invite>("invites")(this.live);
  }
  public tenants(): Collection<Readonly<Tenant>> {
    return createCollection<Tenant>("tenants")(this.live);
  }
  public sites(): Collection<Readonly<Site>> {
    return createCollection<Site>("sites")(this.live);
  }
  public stories(): Collection<Readonly<Story>> {
    return createCollection<Story>("stories")(this.live);
  }
  public comments(): Collection<Readonly<Comment>> {
    return createCollection<Comment>("comments")(this.live);
  }
  public commentActions(): Collection<Readonly<CommentAction>> {
    return createCollection<CommentAction>("commentActions")(this.live);
  }
  public commentModerationActions(): Collection<
    Readonly<CommentModerationAction>
  > {
    return createCollection<CommentModerationAction>(
      "commentModerationActions"
    )(this.live);
  }
  public queries(): Collection<Readonly<PersistedQuery>> {
    return createCollection<PersistedQuery>("queries")(this.live);
  }
  public migrations(): Collection<Readonly<MigrationRecord>> {
    return createCollection<MigrationRecord>("migrations")(this.live);
  }
  public archivedComments(): Collection<Readonly<Comment>> {
    if (!this.archive) {
      throw new Error(
        "Cannot create archived collection because archive is null"
      );
    }

    return createCollection<Comment>("archivedComments")(this.archive);
  }
  public archivedCommentActions(): Collection<Readonly<CommentAction>> {
    if (!this.archive) {
      throw new Error(
        "Cannot create archived collection because archive is null"
      );
    }

    return createCollection<CommentAction>("archivedCommentActions")(
      this.archive
    );
  }
  public archivedCommentModerationActions(): Collection<
    Readonly<CommentModerationAction>
  > {
    if (!this.archive) {
      throw new Error(
        "Cannot create archived collection because archive is null"
      );
    }

    return createCollection<CommentModerationAction>(
      "archivedCommentModerationActions"
    )(this.archive);
  }
}

export async function createMongoContext(
  config: Config
): Promise<MongoContext> {
  // Setup MongoDB.
  const liveURI = config.get("mongodb");
  const live = await createMongoDB(liveURI);

  // If we have an archive URI, use it, otherwise, default
  // to using the live database
  let archive: Db | null = null;
  const archiveURI = config.get("mongodb_archive");
  if (
    archiveURI === config.default("mongodb_archive") &&
    liveURI !== config.default("mongodb")
  ) {
    archive = live;
  } else {
    archive = await createMongoDB(archiveURI);
  }

  return new MongoContextImpl(live, archive);
}
