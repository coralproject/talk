import DataLoader from "dataloader";
import { Db } from "mongodb";

import { Config } from "coral-server/config";
import { Comment, retrieveManyComments } from "coral-server/models/comment";
import { retrieveManyStories, Story } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { retrieveManyUsers, User } from "coral-server/models/user";
import { JWTSigningConfig } from "coral-server/services/jwt";

import { generateUnsubscribeURL } from "./categories/unsubscribe";

interface Options {
  mongo: Db;
  tenant: Tenant;
  now: Date;
  config: Config;
  signingConfig: JWTSigningConfig;
}

/**
 * NotificationContext provides a caching layer used by the notifications to
 * collect data to include in notifications to be sent.
 */
export default class NotificationContext {
  private readonly mongo: Db;
  private readonly signingConfig: JWTSigningConfig;

  /**
   * tenant is the tenant performing this particular operation.
   */
  public readonly tenant: Tenant;

  /**
   * now is the current date.
   */
  public readonly now: Date;

  /**
   * config is used when generating the unsubscribe url's.
   */
  public readonly config: Config;

  /**
   * users is a `DataLoader` used to retrieve users efficiently.
   */
  public readonly users: DataLoader<
    string,
    Readonly<User> | null
  > = new DataLoader(userIDs =>
    retrieveManyUsers(this.mongo, this.tenant.id, userIDs)
  );

  /**
   * comments is a `DataLoader` used to retrieve comments efficiently.
   */
  public readonly comments: DataLoader<
    string,
    Readonly<Comment> | null
  > = new DataLoader(commentIDs =>
    retrieveManyComments(this.mongo, this.tenant.id, commentIDs)
  );

  /**
   * stories is a `DataLoader` used to retrieve stories efficiently.
   */
  public readonly stories: DataLoader<
    string,
    Readonly<Story> | null
  > = new DataLoader(storyIDs =>
    retrieveManyStories(this.mongo, this.tenant.id, storyIDs)
  );

  constructor({ mongo, tenant, now, config, signingConfig }: Options) {
    this.mongo = mongo;
    this.tenant = tenant;
    this.now = now;
    this.config = config;
    this.signingConfig = signingConfig;
  }

  /**
   * generateUnsubscribeURL will generate a unsubscribe token.
   *
   * @param user the user to generate the unsubscribe token for
   */
  public async generateUnsubscribeURL(user: Pick<User, "id">) {
    return generateUnsubscribeURL(
      this.tenant,
      this.config,
      this.signingConfig,
      user,
      this.now
    );
  }
}
