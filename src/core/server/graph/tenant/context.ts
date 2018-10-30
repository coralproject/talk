import { Redis } from "ioredis";
import { Db } from "mongodb";

import CommonContext from "talk-server/graph/common/context";
import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";
import { TaskQueue } from "talk-server/queue";
import TenantCache from "talk-server/services/tenant/cache";
import { Request } from "talk-server/types/express";

import { Config } from "talk-common/config";
import loaders from "./loaders";
import mutators from "./mutators";

export interface TenantContextOptions {
  mongo: Db;
  redis: Redis;
  tenant: Tenant;
  tenantCache: TenantCache;
  queue: TaskQueue;
  config: Config;
  req?: Request;
  user?: User;
}

export default class TenantContext extends CommonContext {
  public readonly tenant: Tenant;
  public readonly tenantCache: TenantCache;
  public readonly user?: User;
  public readonly mongo: Db;
  public readonly redis: Redis;
  public readonly queue: TaskQueue;
  public readonly loaders: ReturnType<typeof loaders>;
  public readonly mutators: ReturnType<typeof mutators>;

  constructor({
    req,
    user,
    tenant,
    mongo,
    redis,
    config,
    tenantCache,
    queue,
  }: TenantContextOptions) {
    super({ user, req, config });

    this.tenant = tenant;
    this.tenantCache = tenantCache;
    this.user = user;
    this.mongo = mongo;
    this.redis = redis;
    this.queue = queue;
    this.loaders = loaders(this);
    this.mutators = mutators(this);
  }
}
