import { UserNotFoundError } from "coral-server/errors";
import { User } from "coral-server/models/user";
import { AugmentedRedis } from "coral-server/services/redis";

import { MongoContext } from "../context";

export const USER_CACHE_DATA_EXPIRY = 24 * 60 * 60;

export class UserCache {
  private mongo: MongoContext;
  private redis: AugmentedRedis;

  private usersByKey: Map<string, Readonly<User>>;

  constructor(mongo: MongoContext, redis: AugmentedRedis) {
    this.mongo = mongo;
    this.redis = redis;

    this.usersByKey = new Map<string, Readonly<User>>();
  }

  private computeDataKey(tenantID: string, id: string) {
    const key = `${tenantID}:${id}:data`;
    return key;
  }

  private async populateUsers(tenantID: string, userIDs: string[]) {
    const users = await this.mongo
      .users()
      .find({ tenantID, id: { $in: userIDs } })
      .toArray();

    const cmd = this.redis.multi();

    for (const user of users) {
      cmd.set(this.computeDataKey(tenantID, user.id), JSON.stringify(user));
      cmd.expire(
        this.computeDataKey(tenantID, user.id),
        USER_CACHE_DATA_EXPIRY
      );
    }

    await cmd.exec();

    return users;
  }

  public async findUser(tenantID: string, id: string) {
    const key = this.computeDataKey(tenantID, id);
    let user = this.usersByKey.get(key);
    if (!user) {
      let record = await this.redis.get(key);
      if (!record) {
        await this.populateUsers(tenantID, [id]);
      }

      record = await this.redis.get(`${tenantID}:${id}:data`);
      if (!record) {
        throw new UserNotFoundError(id);
      }

      user = JSON.parse(record) as User;
      this.usersByKey.set(key, user);
    }

    if (!user) {
      throw new UserNotFoundError(id);
    }

    return user;
  }
}
