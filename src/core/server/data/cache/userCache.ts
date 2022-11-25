import { UserNotFoundError } from "coral-server/errors";
import { User } from "coral-server/models/user";
import { AugmentedRedis } from "coral-server/services/redis";

import { MongoContext } from "../context";

export class UserCache {
  private mongo: MongoContext;
  private redis: AugmentedRedis;

  constructor(mongo: MongoContext, redis: AugmentedRedis) {
    this.mongo = mongo;
    this.redis = redis;
  }

  private async populateUsers(tenantID: string, userIDs: string[]) {
    const users = await this.mongo
      .users()
      .find({ tenantID, id: { $in: userIDs } })
      .toArray();

    const cmd = this.redis.multi();

    for (const user of users) {
      cmd.set(`${tenantID}:${user.id}:data`, JSON.stringify(user));
      cmd.expire(`${tenantID}:${user.id}:data`, 24 * 60 * 60);
    }

    await cmd.exec();

    return users;
  }

  public async findUser(tenantID: string, id: string) {
    let record = await this.redis.get(`${tenantID}:${id}:data`);
    if (!record) {
      await this.populateUsers(tenantID, [id]);
    }

    record = await this.redis.get(`${tenantID}:${id}:data`);
    if (!record) {
      throw new UserNotFoundError(id);
    }

    const user = JSON.parse(record) as User;

    return user;
  }
}
