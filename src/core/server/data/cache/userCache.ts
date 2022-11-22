import { UserNotFoundError } from "coral-server/errors";
import { User } from "coral-server/models/user";
import { MongoContext } from "../context";

export class UserCache {
  private mongo: MongoContext;

  private userLookup: Map<string, Readonly<User>>;

  constructor(mongo: MongoContext) {
    this.mongo = mongo;

    this.userLookup = new Map<string, Readonly<User>>();
  }

  public async loadUsersForIDs(tenantID: string, userIDs: string[]) {
    const uniqueUserIDs = Array.from(new Set(userIDs));
    const users = await this.mongo
      .users()
      .find({ tenantID, id: { $in: uniqueUserIDs } })
      .toArray();

    for (const user of users) {
      this.userLookup.set(user.id, user);
    }
  }

  public async findUser(tenantID: string, id: string) {
    if (!this.userLookup.has(id)) {
      await this.loadUsersForIDs(tenantID, [id]);
    }

    const user = this.userLookup.get(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    return user;
  }
}
