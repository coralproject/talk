import { UserNotFoundError } from "coral-server/errors";
import { User } from "coral-server/models/user";
import { MongoContext } from "../context";

const USER_BATCH_SIZE = 5;

export class UserCache {
  private mongo: MongoContext;

  private userLookup: Map<string, Readonly<User>>;

  constructor(mongo: MongoContext) {
    this.mongo = mongo;

    this.userLookup = new Map<string, Readonly<User>>();
  }

  public async loadUsersForIDs(tenantID: string, userIDs: string[]) {
    const batches: string[][] = [];
    batches.push([]);

    let currentBatch = 0;
    for (const userID of userIDs) {
      batches[currentBatch].push(userID);

      if (batches[currentBatch].length >= USER_BATCH_SIZE) {
        batches.push([]);
        currentBatch++;
      }
    }

    const results = await Promise.all(
      batches.map((batch) => {
        return this.mongo
          .users()
          .find({ tenantID, id: { $in: batch } })
          .toArray();
      })
    );

    for (const batch of results) {
      for (const user of batch) {
        this.userLookup.set(user.id, user);
      }
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
