import zlib from "zlib";

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
      cmd.set(
        this.computeDataKey(tenantID, user.id),
        this.serializeObject(user)
      );
      cmd.expire(
        this.computeDataKey(tenantID, user.id),
        USER_CACHE_DATA_EXPIRY
      );
    }

    await cmd.exec();

    return users;
  }

  public async loadUsers(tenantID: string, ids: string[]) {
    const keys = ids.map((id) => this.computeDataKey(tenantID, id));
    const records = await this.redis.mget(keys);

    for (const record of records) {
      if (!record) {
        continue;
      }

      const user = this.deserializeObject(record);
      this.usersByKey.set(this.computeDataKey(tenantID, user.id), user);
    }
  }

  public async findUser(tenantID: string, id: string) {
    const key = this.computeDataKey(tenantID, id);
    let user = this.usersByKey.get(key);
    if (!user) {
      let record = await this.redis.get(key);
      if (!record) {
        await this.populateUsers(tenantID, [id]);
      }

      record = await this.redis.get(this.computeDataKey(tenantID, id));
      if (!record) {
        throw new UserNotFoundError(id);
      }

      user = this.deserializeObject(record);
      this.usersByKey.set(key, user);
    }

    if (!user) {
      throw new UserNotFoundError(id);
    }

    return user;
  }

  private serializeObject(comment: Readonly<User>) {
    const json = JSON.stringify(comment);
    const data = zlib.brotliCompressSync(json).toString("base64");

    return data;
  }

  private deserializeObject(data: string): Readonly<User> {
    const buffer = Buffer.from(data, "base64");
    const json = zlib.brotliDecompressSync(buffer).toString();
    const parsed = JSON.parse(json);

    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
    };
  }
}
