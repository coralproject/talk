import { UserNotFoundError } from "coral-server/errors";
import { Logger } from "coral-server/logger";
import { User } from "coral-server/models/user";
import { AugmentedRedis } from "coral-server/services/redis";
import { TenantCache } from "coral-server/services/tenant/cache";

import { MongoContext } from "../context";
import { dataCacheAvailable, IDataCache } from "./dataCache";

export class UserCache implements IDataCache {
  private expirySeconds: number;

  private mongo: MongoContext;
  private redis: AugmentedRedis;
  private tenantCache: TenantCache | null;
  private logger: Logger;

  private usersByKey: Map<string, Readonly<User>>;

  constructor(
    mongo: MongoContext,
    redis: AugmentedRedis,
    tenantCache: TenantCache | null,
    logger: Logger,
    expirySeconds: number
  ) {
    this.mongo = mongo;
    this.redis = redis;
    this.tenantCache = tenantCache;
    this.logger = logger.child({ dataCache: "UserCache" });

    this.expirySeconds = expirySeconds;

    this.usersByKey = new Map<string, Readonly<User>>();
  }

  public async available(tenantID: string): Promise<boolean> {
    return dataCacheAvailable(this.tenantCache, tenantID);
  }

  private computeDataKey(tenantID: string, id: string) {
    const key = `${tenantID}:${id}:userData`;
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

    if (records.length !== ids.length) {
      await this.populateUsers(tenantID, ids);
    }

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
    return json;
  }

  private deserializeObject(data: string): Readonly<User> {
    const parsed = JSON.parse(data);
    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
    };
  }
}
