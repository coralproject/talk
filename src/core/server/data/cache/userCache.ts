import zlib from "zlib";

import { UserNotFoundError } from "coral-server/errors";
import { Logger } from "coral-server/logger";
import { User } from "coral-server/models/user";
import { AugmentedRedis } from "coral-server/services/redis";

import { MongoContext } from "../context";

export class UserCache {
  private expirySeconds: number;

  private mongo: MongoContext;
  private redis: AugmentedRedis;
  private logger: Logger;

  private usersByKey: Map<string, Readonly<User>>;

  constructor(
    mongo: MongoContext,
    redis: AugmentedRedis,
    logger: Logger,
    expirySeconds: number
  ) {
    this.mongo = mongo;
    this.redis = redis;
    this.logger = logger.child({ dataCache: "UserCache" });

    this.expirySeconds = expirySeconds;

    this.usersByKey = new Map<string, Readonly<User>>();
  }

  private computeDataKey(tenantID: string, id: string) {
    const key = `${tenantID}:${id}:data`;
    return key;
  }

  public async populateUsers(tenantID: string, userIDs: string[]) {
    const users = await this.mongo
      .users()
      .find({ tenantID, id: { $in: userIDs } })
      .toArray();

    const cmd = this.redis.multi();

    for (const user of users) {
      const dataKey = this.computeDataKey(tenantID, user.id);
      cmd.set(dataKey, this.serializeObject(user));
      cmd.expire(dataKey, this.expirySeconds);

      this.usersByKey.set(dataKey, user);
    }

    await cmd.exec();

    return users;
  }

  public async loadUsers(tenantID: string, ids: string[]) {
    const keys = ids.map((id) => this.computeDataKey(tenantID, id));

    const start = Date.now();
    const records = keys && keys.length > 0 ? await this.redis.mget(keys) : [];
    const end = Date.now();
    this.logger.info({ elapsedMs: end - start }, "loadUsers - mget");

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
      const start = Date.now();
      let record = await this.redis.get(key);
      const end = Date.now();
      this.logger.info({ elapsedMs: end - start }, "findUser - get");

      if (!record) {
        await this.populateUsers(tenantID, [id]);
        record = await this.redis.get(key);
      }

      // check that we have a record after trying to ensure
      // it exists via populate users
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
