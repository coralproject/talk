import Logger from "bunyan";
import DataLoader from "dataloader";
import { Db } from "mongodb";

import { Config } from "coral-server/config";
import { Comment, retrieveManyComments } from "coral-server/models/comment";
import { retrieveManyStories, Story } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { retrieveManyUsers, User } from "coral-server/models/user";
import { Request } from "coral-server/types/express";

interface Options {
  mongo: Db;
  tenant: Pick<Tenant, "id" | "domain">;
  config: Config;
  req?: Request;
}

class SlackContext {
  public readonly mongo: Db;
  public readonly tenant: Pick<Tenant, "id" | "domain">;
  public readonly logger: Logger;
  public readonly config: Config;
  public readonly req?: Request;

  public readonly comments: DataLoader<
    string,
    Readonly<Comment> | null
  > = new DataLoader(commentIDs =>
    retrieveManyComments(this.mongo, this.tenant.id, commentIDs)
  );

  public readonly stories: DataLoader<
    string,
    Readonly<Story> | null
  > = new DataLoader(storyIDs =>
    retrieveManyStories(this.mongo, this.tenant.id, storyIDs)
  );

  public readonly users: DataLoader<
    string,
    Readonly<User> | null
  > = new DataLoader(userIDs =>
    retrieveManyUsers(this.mongo, this.tenant.id, userIDs)
  );

  constructor({ mongo, tenant, config, req }: Options) {
    this.mongo = mongo;
    this.tenant = tenant;
    this.config = config;
    this.req = req;
  }
}

export default SlackContext;
