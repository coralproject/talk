import { Db } from "mongodb";

import { AugmentedRedis } from "coral-server/services/redis";

export interface MongoContext {
  readonly live: Db;
  readonly archive: Db;
}

interface DataContextOptions {
  mongoLive: Db;
  mongoArchive: Db;
  redis: AugmentedRedis;
}

export default class DataContext {
  public readonly mongo: MongoContext;
  public readonly redis: AugmentedRedis;

  constructor(options: DataContextOptions) {
    this.mongo = {
      live: options.mongoLive,
      archive: options.mongoArchive,
    };

    this.redis = options.redis;
  }
}
