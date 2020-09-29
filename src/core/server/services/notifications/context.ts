import DataLoader from "dataloader";

import { Config } from "coral-server/config";
import { retrieveManyComments } from "coral-server/models/comment";
import { retrieveManyStories } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import {
  insertUserNotificationDigests,
  retrieveManyUsers,
  User,
} from "coral-server/models/user";
import { DigestibleTemplate } from "coral-server/queue/tasks/mailer/templates";
import { SigningConfig } from "coral-server/services/jwt";

import { Mongo } from "../mongodb";
import { generateUnsubscribeURL } from "./categories/unsubscribe";

interface Options {
  mongo: Mongo;
  tenant: Tenant;
  config: Config;
  signingConfig: SigningConfig;
  now?: Date;
}

/**
 * NotificationContext provides a caching layer used by the notifications to
 * collect data to include in notifications to be sent.
 */
export default class NotificationContext {
  private readonly mongo: Mongo;
  private readonly signingConfig: SigningConfig;

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
  public readonly users = new DataLoader((userIDs: string[]) =>
    retrieveManyUsers(this.mongo, this.tenant.id, userIDs)
  );

  /**
   * comments is a `DataLoader` used to retrieve comments efficiently.
   */
  public readonly comments = new DataLoader((commentIDs: string[]) =>
    retrieveManyComments(this.mongo, this.tenant.id, commentIDs)
  );

  /**
   * stories is a `DataLoader` used to retrieve stories efficiently.
   */
  public readonly stories = new DataLoader((storyIDs: string[]) =>
    retrieveManyStories(this.mongo, this.tenant.id, storyIDs)
  );

  constructor({
    tenant,
    mongo,
    config,
    signingConfig,
    now = new Date(),
  }: Options) {
    this.mongo = mongo;
    this.config = config;
    this.signingConfig = signingConfig;
    this.tenant = tenant;
    this.now = now;
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
}
