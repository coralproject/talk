import DataLoader from "dataloader";
import { Db } from "mongodb";

import { Config } from "coral-server/config";
import logger, { Logger } from "coral-server/logger";
import { Comment, retrieveManyComments } from "coral-server/models/comment";
import { retrieveManyStories, Story } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import {
  insertUserNotificationDigests,
  pullUserNotificationDigests,
  retrieveManyUsers,
  User,
} from "coral-server/models/user";
import { DigestibleTemplate } from "coral-server/queue/tasks/mailer/templates";
import { JWTSigningConfig } from "coral-server/services/jwt";

import { GQLDIGEST_FREQUENCY } from "coral-server/graph/schema/__generated__/types";

import { generateUnsubscribeURL } from "./categories/unsubscribe";

interface Options {
  mongo: Db;
  archive: Db;
  tenant: Tenant;
  config: Config;
  signingConfig: JWTSigningConfig;
  now?: Date;
  log?: Logger;
}

/**
 * NotificationContext provides a caching layer used by the notifications to
 * collect data to include in notifications to be sent.
 */
export default class NotificationContext {
  private readonly mongo: Db;
  private readonly archive: Db;
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
   * log is the context wrapped logger for this NotificationContext.
   */
  public readonly log: Logger;

  /**
   * users is a `DataLoader` used to retrieve users efficiently.
   */
  public readonly users: DataLoader<
    string,
    Readonly<User> | null
  > = new DataLoader((userIDs) =>
    retrieveManyUsers(this.mongo, this.tenant.id, userIDs)
  );

  /**
   * comments is a `DataLoader` used to retrieve comments efficiently.
   */
  public readonly comments: DataLoader<
    string,
    Readonly<Comment> | null
  > = new DataLoader((commentIDs) =>
    retrieveManyComments(this.mongo, this.archive, this.tenant.id, commentIDs)
  );

  /**
   * stories is a `DataLoader` used to retrieve stories efficiently.
   */
  public readonly stories: DataLoader<
    string,
    Readonly<Story> | null
  > = new DataLoader((storyIDs) =>
    retrieveManyStories(this.mongo, this.tenant.id, storyIDs)
  );

  constructor({
    mongo,
    archive,
    tenant,
    now = new Date(),
    log = logger,
    config,
    signingConfig,
  }: Options) {
    this.mongo = mongo;
    this.archive = archive;
    this.tenant = tenant;
    this.now = now;
    this.config = config;
    this.signingConfig = signingConfig;
    this.log = log.child({ tenantID: tenant.id }, true);
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

  /**
   * addDigests will add the given templates to the User so that they will be
   * digested.
   */
  public async addDigests(userID: string, templates: DigestibleTemplate[]) {
    const user = await insertUserNotificationDigests(
      this.mongo,
      this.tenant.id,
      userID,
      templates,
      this.now
    );

    this.users.prime(user.id, user);

    return user;
  }

  /**
   * digest will return an `asyncIterator` that can be used to iterate over all
   * the users on a Tenant that have digests available configured with the given
   * frequency.
   *
   * @param frequency the frequency to get the digests for
   */
  public digest(frequency: GQLDIGEST_FREQUENCY) {
    // `this` isn't available inside the iterator function, so extract it here.
    const { mongo, tenant } = this;
    return {
      async *[Symbol.asyncIterator]() {
        while (true) {
          const user = await pullUserNotificationDigests(
            mongo,
            tenant.id,
            frequency
          );
          if (!user) {
            break;
          }

          yield user;
        }
      },
    };
  }
}
