import Logger from "bunyan";
import DataLoader from "dataloader";
import { Db } from "mongodb";

import { Comment, retrieveManyComments } from "coral-server/models/comment";
import { retrieveManyStories, Story } from "coral-server/models/story";
import { retrieveManyUsers, User } from "coral-server/models/user";

interface Options {
  mongo: Db;
  tenantID: string;
}

class SlackContext {
  public readonly mongo: Db;
  public readonly tenantID: string;
  public readonly logger: Logger;

  public readonly comments: DataLoader<
    string,
    Readonly<Comment> | null
  > = new DataLoader(commentIDs =>
    retrieveManyComments(this.mongo, this.tenantID, commentIDs)
  );

  public readonly stories: DataLoader<
    string,
    Readonly<Story> | null
  > = new DataLoader(storyIDs =>
    retrieveManyStories(this.mongo, this.tenantID, storyIDs)
  );

  public readonly users: DataLoader<
    string,
    Readonly<User> | null
  > = new DataLoader(userIDs =>
    retrieveManyUsers(this.mongo, this.tenantID, userIDs)
  );

  constructor({ mongo, tenantID }: Options) {
    this.mongo = mongo;
    this.tenantID = tenantID;
  }
}

export default SlackContext;
