import { Redis } from "ioredis";
import { Db } from "mongodb";

import CommonContext from "talk-server/graph/common/context";
import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";
import { TaskQueue } from "talk-server/services/queue";
import TenantCache from "talk-server/services/tenant/cache";
import { Request } from "talk-server/types/express";

import loaders from "./loaders";
import mutators from "./mutators";

export interface TenantContextOptions {
  mongo: Db;
  redis: Redis;
  tenant: Tenant;
  tenantCache: TenantCache;
  queue: TaskQueue;
  req?: Request;
  user?: User;
}

export default class TenantContext extends CommonContext {
  public tenant: Tenant;
  public tenantCache: TenantCache;
  public user?: User;
  public mongo: Db;
  public redis: Redis;
  public queue: TaskQueue;
  public loaders: ReturnType<typeof loaders>;
  public mutators: ReturnType<typeof mutators>;

  constructor({
    req,
    user,
    tenant,
    mongo,
    redis,
    tenantCache,
    queue,
  }: TenantContextOptions) {
    super({ user, req });

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
