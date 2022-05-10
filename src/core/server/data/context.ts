import { Collection, Db, MongoClient } from "mongodb";

import { Config } from "coral-server/config";
import { CommentAction } from "coral-server/models/action/comment";
import { CommentModerationAction } from "coral-server/models/action/moderation/comment";
import { Comment } from "coral-server/models/comment";
import { createCollection } from "coral-server/models/helpers";
import { Invite } from "coral-server/models/invite";
import { MigrationRecord } from "coral-server/models/migration";
import { PersistedQuery } from "coral-server/models/queries";
import { SeenComments } from "coral-server/models/seenComments/seenComments";
import { Site } from "coral-server/models/site";
import { Story } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import {
  createMongoInstance,
  MongoInstance,
} from "coral-server/services/mongodb";

export interface MongoContext {
  readonly liveClient: MongoClient;
  readonly archiveClient?: MongoClient;
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
  seenComments(): Collection<Readonly<SeenComments>>;
}

export class MongoContextImpl implements MongoContext {
  public readonly liveClient: MongoClient;
  public readonly archiveClient?: MongoClient;
  public readonly live: Db;
  public readonly archive?: Db;

  constructor(
    liveClient: MongoClient,
    live: Db,
    archiveClient?: MongoClient,
    archive?: Db
  ) {
    this.live = live;
    this.archive = archive;

    this.liveClient = liveClient;
    this.archiveClient = archiveClient;
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
  public seenComments(): Collection<Readonly<SeenComments>> {
    return createCollection<SeenComments>("seenComments")(this.live);
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

export function isArchivingEnabled(config: Config): boolean {
  const mongoURI = config.get("mongodb");
  const archiveURI = config.get("mongodb_archive");

  return (
    archiveURI !== config.default("mongodb_archive") && archiveURI !== mongoURI
  );
}

export async function createMongoContext(
  config: Config
): Promise<MongoContext> {
  // Setup MongoDB.
  const liveURI = config.get("mongodb");
  const live = await createMongoInstance(liveURI);

  // If we have an archive URI, use it, otherwise, default
  // to using the live database
  let archive: MongoInstance | null = null;
  const archiveURI = config.get("mongodb_archive");
  if (
    archiveURI === config.default("mongodb_archive") &&
    liveURI !== config.default("mongodb")
  ) {
    archive = live;
  } else {
    archive = await createMongoInstance(archiveURI);
  }

  return new MongoContextImpl(
    live.client,
    live.db,
    archive ? archive.client : undefined,
    archive ? archive.db : undefined
  );
}
